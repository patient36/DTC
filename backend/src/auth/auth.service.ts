import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
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
      expiresIn: '7d',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
}
