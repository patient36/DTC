import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Injectable, HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly MailService: MailService,
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
      sameSite: 'none',
      maxAge: 6 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user;
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
      'Welcome to DTC',
      'Your account was created at DTC successfully. Thank you for signing up!',
    );

    return newUser;
  }

  // Logout
  async logout(res: Response) {
    res.clearCookie('auth_token');
    return { message: 'User logged out successfully' };
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
        expiresIn: '5min',
      });
      const body = `<code>Use this token <strong style="color: blue">${token}</strong> to reset your password on DTC and keep it your secret don't share it with anyone</code>`
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
