import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { StripeService } from 'src/billing/stripe/stripe.service';
import { AuthedUser } from 'src/common/types/currentUser';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly MailService: MailService,
    private readonly stripe: StripeService
  ) { }

  // Login
  async authUser(dto: AuthDto, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '6h',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 6 * 60 * 60 * 1000,
    });

    const safeUser = { name: user.name, email: user.email, role: user.role }
    return safeUser;
  }

  // Register
  async createUser(dto: CreateUserDto) {
    if (!dto.name || !dto.email || !dto.password) {
      throw new HttpException(
        'Name, email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
    });

    await this.MailService.sendEmail(
      newUser.email,
      'Welcome to DTC 🎉',
      `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #2c3e50;">Welcome to <span style="color: #007bff;">DTC</span>, ${newUser.name}!</h2>
          <p>We're excited to have you on board. Your account has been <strong style="color: #28a745;">successfully created</strong>.</p>
          <p>Here’s what you can do with your new DTC account:</p>
          <ul>
            <li><strong>Create</strong> digital time capsules</li>
            <li><strong>Attach memories</strong> securely with encrypted storage</li>
            <li><strong>Schedule deliveries</strong> for the future</li>
          </ul>
          <p>Thanks for joining us — we're glad you're here!</p>
          <p style="margin-top: 30px;">Warm regards,<br/>The DTC Team</p>
        </div>
      `
    );

    // create new stripe customer
    await this.stripe.attachCustomer(newUser.id, newUser.email)

    const { password, ...safeUser } = newUser
    return { user: safeUser };
  }

  // Logout
  async logout(res: Response) {
    res.clearCookie('auth_token');
    return { message: 'User logged out successfully' };
  }

  // Get current user
  async getCurrentUser({ userId }: AuthedUser) {
    if (!userId) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
  
    try {
      const [user, delivered, pending] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            usedStorage: true,
            createdAt: true,
            paidUntil: true,
          },
        }),
        this.prisma.capsule.count({ where: { ownerId: userId, delivered: true } }),
        this.prisma.capsule.count({ where: { ownerId: userId, delivered: false } }),
      ]);
  
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      return {
        ...user,
        capsules: {
          total: delivered + pending,
          delivered,
          pending,
        },
      };
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      throw error instanceof HttpException
        ? error
        : new HttpException('Failed to retrieve user information', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get reset password token
  async getResetPasswordToken(email: string) {
    try {
      if (!email) {
        throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
      }
      const user = await this.prisma.user.findFirst({ where: { email } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, {
        expiresIn: '10min',
      });
      const body = `
          <div style="font-family: sans-serif; color: #333;">
            <h3>Password Reset Token</h3>
            <p>Use the token below to reset your password on <strong>DTC</strong>. <strong style="color: red;">Do not share this with anyone.</strong></p>
            <div style="background: #f4f4f4; padding: 12px; border-radius: 6px; font-size: 18px; font-family: monospace; color: #007bff; user-select: all;">
              ${token}
            </div>
            <code style="color: green;">Note that this token will expire in 10 minutes </code>
            <p style="margin-top: 20px;">If you did not request this, please ignore the email.</p>
            <p style="margin-top: 30px;">— DTC Security Team</p>
          </div>
        `;

      await this.MailService.sendEmail(user.email, 'Reset Password Token', body);
      return { message: "Token sent to the given email" }
    } catch (error) {
      console.error(error)
      throw new HttpException(
        error instanceof HttpException ? error.message : 'Failed to create capsule',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // reset password 
  async resetPassword(dto: ResetPasswordDto) {
    try {
      const token = jwt.verify(dto.token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

      if (!token.email || token.email !== dto.email) {
        throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.prisma.user.findFirst({ where: { email: dto.email } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

      await this.prisma.user.update({
        where: { email: dto.email },
        data: { password: hashedPassword },
      });

      const body = `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #2c3e50;">Your Password Was Changed</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We wanted to let you know that your <strong style="color: #007bff;">password was successfully changed</strong> on DTC.</p>
          <p>If <strong>you made this change</strong>, no further action is needed.</p>
          <p style="color: #d9534f;"><strong>If you did <u>not</u> change your password</strong>, please:</p>
          <ol>
            <li>Reset your password immediately</li>
            <li>Update your email address if it may be compromised</li>
          </ol>
          <p style="margin-top: 20px;">If you need help, reach out to our support team.</p>
          <p style="margin-top: 30px;">Stay safe,<br/>— The DTC Team</p>
        </div>
      `;
      await this.MailService.sendEmail(user.email, 'Your Password Was Changed', body);

      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error(error);
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        error instanceof HttpException ? error.message : 'Failed to change password',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
