import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';
import { AuthedUser } from 'src/common/types/currentUser';
import { S3Service } from 'src/s3/s3.service';
import { decrypt } from 'src/common/utils/crypto';
import { StripeService } from 'src/billing/stripe/stripe.service';
import { deleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly MailService: MailService,
    private readonly S3Service: S3Service,
    private readonly stripe: StripeService
  ) { }

  // Delete user
  async deleteUser(id: string, dto: deleteUserDto, authedUser: AuthedUser) {
    if (id !== authedUser.userId) {
      throw new HttpException('user ID mismatch', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // validate password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    try {
      const capsules = await this.prisma.capsule.findMany({
        where: { ownerId: user.id },
        select: { attachments: true },
      });

      let deletedFilesCount = 0;

      for (const capsule of capsules) {
        const attachments = Array.isArray(capsule.attachments)
          ? capsule.attachments
          : JSON.parse(capsule.attachments as any);

        for (const { path } of attachments) {
          await this.S3Service.deleteFile(decrypt(path, user.id));
          deletedFilesCount++;
        }
      }

      // delete stripe customer
      await this.stripe.deleteCustomer(user.id);

      const [deletedPayments] = await this.prisma.$transaction([
        this.prisma.payment.deleteMany({ where: { payerId: user.id } }),
        this.prisma.capsule.deleteMany({ where: { ownerId: user.id } }),
        this.prisma.user.delete({ where: { id: user.id } }),
      ]);

      const message = `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Account Deletion Confirmation</h2>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your account has been successfully <strong style="color: #d9534f;">deleted</strong>. Here's a summary of what was removed:</p>
          <ul>
            <li><strong>Account</strong> and personal data</li>
            <li><strong>${capsules.length}</strong> capsule${capsules.length !== 1 ? 's' : ''}</li>
            <li><strong>${deletedFilesCount}</strong> attachment file${deletedFilesCount !== 1 ? 's' : ''}</li>
            <li><strong>${deletedPayments.count}</strong> payment record${deletedPayments.count !== 1 ? 's' : ''}</li>
          </ul>
          <p style="margin-top: 20px;">We're sorry to see you go. If this was a mistake or you have concerns, feel free to contact support.</p>
          <p style="margin-top: 40px;">Best regards,<br/>The DTC Team</p>
        </div>
      `;

      await this.MailService.sendEmail(user.email, 'Account Deletion Confirmation', message);

      const { password, ...safeUser } = user;
      return safeUser;

    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Update user
  async updateUser(id: string, dto: UpdateUserDto, AuthedUser: AuthedUser) {
    try {
      if (id !== AuthedUser.userId) {
        throw new HttpException('user ID mismatch', HttpStatus.BAD_REQUEST);
      }
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

      // update stripe customer
      await this.stripe.syncCustomerEmail(updatedUser.id, updatedUser.email);

      const { password: _, ...safeUser } = updatedUser
      return safeUser;
    } catch (error) {
      console.error('Failed to update user', error);
      throw new HttpException(
        error instanceof HttpException ? error.message : 'Failed to update user',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get payments
  async getPayments(page = 1, limit = 20, authedUser: AuthedUser) {
    page = Math.max(1, page);
    const skip = (page - 1) * limit;
    const payments = await this.prisma.payment.findMany(
      {
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          payerId: authedUser.userId,
        }
      }
    )

    return {
      page,
      limit,
      size: payments.length,
      payments: payments,
    };

  }

}
