import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { AuthedUser } from 'src/common/types/currentUser';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { S3Service } from 'src/s3/s3.service';
import { decrypt } from 'src/common/utils/crypto';
import { StripeService } from 'src/billing/stripe/stripe.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly MailService: MailService,
    private readonly S3Service: S3Service,
    private readonly stripe: StripeService
  ) { }

  // Get an admin registration token
  async getAdminToken(user: AuthedUser, password: string) {
    try {
      const admin = await this.prisma.user.findUnique({ where: { id: user.userId } })
      if (!admin) {
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
      }
      if (!password) {
        throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
      }
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
      }
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });
      return { token }
    } catch (error) {
      console.error('Failed to generate Admin token', error)
      throw new HttpException(
        error instanceof HttpException ? error.message : 'Failed to generate Admin token',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Register new Admin
  async create(dto: CreateAdminDto) {
    try {
      const token = jwt.verify(dto.adminToken, process.env.JWT_SECRET as string) as jwt.JwtPayload;

      const issuer = await this.prisma.user.findUnique({
        where: { email: token.email },
        select: { name: true, email: true, role: true },
      });

      if (issuer?.role !== "ADMIN") {
        throw new BadRequestException("Only Admins can provide Admin registration tokens");
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const admin = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      // Send welcome email to new admin
      await this.MailService.sendEmail(
        admin.email,
        "🎉 Welcome Aboard, Admin!",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Welcome to the Admin Team, ${admin.name}!</h2>
            <p>You have been granted admin access by <strong>${issuer.name}</strong>.</p>
      
            <p>As an admin, you can now:</p>
            <ul>
              <li>Manage users and data</li>
              <li>Access advanced dashboards</li>
              <li>Make system-level changes</li>
            </ul>
      
            <p>If you weren’t expecting this access, please contact our support team immediately.</p>
      
            <hr />
            <p style="font-size: 0.9em; color: #777;">This is an automated email. Please do not reply.</p>
          </div>
        `
      );

      // Notify issuer admin
      await this.MailService.sendEmail(
        issuer.email,
        "✅ Admin Created Successfully",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">You’ve Added a New Admin</h2>
      
            <p>You successfully authorized the creation of a new admin account.</p>
      
            <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td><strong>Name:</strong></td>
                <td>${admin.name}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>${admin.email}</td>
              </tr>
            </table>
      
            <p>If this action was not performed by you, please report it immediately.</p>
      
            <hr />
            <p style="font-size: 0.9em; color: #777;">This is an automated confirmation of your admin token usage.</p>
          </div>
        `
      );


      // Notify other admins (excluding the issuer and new admin)
      const otherAdmins = await this.prisma.user.findMany({
        where: {
          role: "ADMIN",
          NOT: [
            { email: admin.email },
            { email: issuer.email },
          ],
        },
        select: { email: true },
      });

      await Promise.all(
        otherAdmins.map(({ email }) =>
          this.MailService.sendEmail(
            email,
            "🔔 New Admin Account Created",
            `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h3 style="color: #2196F3;">New Admin Alert</h3>
      
                <p>A new admin has joined the system:</p>
                <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>${admin.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>${admin.email}</td>
                  </tr>
                  <tr>
                    <td><strong>Added By:</strong></td>
                    <td>${issuer.name} (${issuer.email})</td>
                  </tr>
                </table>
      
                <p>Keep an eye on the activity logs for any updates.</p>
      
                <hr />
                <p style="font-size: 0.9em; color: #777;">This is an internal notification for administrators only.</p>
              </div>
            `
          )
        )
      );

      const { password, ...adminSafe } = admin;
      return { admin: adminSafe };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestException("Invalid or expired admin token");
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException("Failed to create admin");
    }
  }

  // Get all users
  async findAllUser(page = 1, limit = 20) {
    page = Math.max(1, page);
    const skip = (page - 1) * limit;

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      where: {
        role: "USER"
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const admins = await this.prisma.user.findMany({
      skip,
      take: limit,
      where: {
        role: "ADMIN"
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const sanitizedUsers = users.map(({ password, ...user }) => user);
    const sanitizedAdmins = admins.map(({ password, ...user }) => user)
    const totalAdmins = await this.prisma.user.count({ where: { role: 'ADMIN' } })
    const totalUsers = await this.prisma.user.count({ where: { role: 'USER' } })

    return {
      page,
      limit,
      totalUsers: totalAdmins + totalUsers,
      admins: {
        size: sanitizedAdmins.length,
        users: sanitizedAdmins,
        total: totalAdmins
      },
      users: {
        size: sanitizedUsers.length,
        users: sanitizedUsers,
        total: totalUsers
      },
    };
  }

  // Get all payments
  async findAllPayments(page = 1, limit = 20) {
    page = Math.max(1, page);
    const skip = (page - 1) * limit;

    const payments = await this.prisma.payment.findMany(
      {
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }
    )

    return {
      page,
      limit,
      size: payments.length,
      payments: payments,
    };

  }

  // Delete user
  async deleteUser(id: string) {
    if (!id) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      const capsules = await this.prisma.capsule.findMany({
        where: { ownerId: user.id },
        select: { id: true, attachments: true },
      });

      let deletedFilesCount = 0;

      for (const capsule of capsules) {
        const attachments = Array.isArray(capsule.attachments)
          ? capsule.attachments
          : JSON.parse(capsule.attachments as any);

        for (const attachment of attachments) {
          await this.S3Service.deleteFile(decrypt(attachment.path, user.id));
          deletedFilesCount++;
        }
      }

      //delete stripe customer
      await this.stripe.deleteCustomer(user.id)

      await this.prisma.$transaction([
        this.prisma.payment.deleteMany({ where: { payerId: user.id } }),
        this.prisma.capsule.deleteMany({ where: { ownerId: user.id } }),
        this.prisma.user.delete({ where: { id: user.id } }),
      ]);

      const message = `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Account Deletion by Admin</h2>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your account has been <strong style="color: #d9534f;">deleted by a system administrator</strong>. Here's what was removed:</p>
          <ul>
            <li><strong>${capsules.length}</strong> capsule${capsules.length !== 1 ? 's' : ''}</li>
            <li><strong>${deletedFilesCount}</strong> file${deletedFilesCount !== 1 ? 's' : ''}</li>
            <li><strong>All payment records</strong></li>
          </ul>
          <p>If this was done in error or you have concerns, please contact our support.</p>
          <p style="margin-top: 40px;">Regards,<br/>DTC Team</p>
        </div>
      `;

      await this.MailService.sendEmail(
        user.email,
        'Your Account Has Been Deleted',
        message
      );

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

}
