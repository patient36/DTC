import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly MailService: MailService,
  ) { }

  // Delete user
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (user) {
      await this.prisma.user.delete({ where: { id: id } });
      await this.MailService.sendEmail(
        user.email,
        'Account deletion',
        `Dear ${user.name}, we are terribly sad to see you go. Your account has been deleted.`,
      );
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  // Update user
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updates = {
      name: dto.name || user.name,
      email: dto.email || user.email,
      password: user.password,
    };
    if (dto.oldPassword && dto.newPassword) {
      const isOldPasswordValid = await bcrypt.compare(
        dto.oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        throw new HttpException(
          'Old password is incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }
      updates.password = await bcrypt.hash(dto.newPassword, 10);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: updates,
    });
    const { password: _, ...safeUser } = updatedUser
    return safeUser;
  }

  // Get user
  async findUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { password, ...safeUser } = user
    return safeUser
  }

  // Get all users
  async findAll(page = 1, limit = 20) {
    page = Math.max(1, page);
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
    });

    const sanitized = users.map(({ password, ...user }) => user);

    return {
      page,
      limit,
      size: sanitized.length,
      users: sanitized,
    };
  }

}
