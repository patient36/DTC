import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { S3Service } from 'src/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { encrypt, decrypt } from 'src/common/utils/crypto';
import { AuthedUser } from 'src/common/types/currentUser';

@Injectable()
export class CapsulesService {

  constructor(private readonly prisma: PrismaService, private readonly S3Service: S3Service) { }

  async create(dto: CreateCapsuleDto, files: Express.Multer.File[], user: AuthedUser) {
    try {
      const { userId } = user;

      if (new Date(dto.deliveryDate) < new Date(new Date().setMonth(new Date().getMonth() + 2))) {
        throw new HttpException('Delivery date must be at least 2 months from now', HttpStatus.BAD_REQUEST);
      }

      const attachments = files?.length
        ? await Promise.all(
          files.map(async (file) => ({
            path: encrypt(await this.S3Service.uploadFile(file), userId),
            size: file.size,
            type: file.mimetype,
          }))
        )
        : [];


      const totalSizeBytes = attachments.reduce((sum, { size }) => sum + size, 0);
      const totalSizeGB = totalSizeBytes / (1024 ** 3);

      const capsule = await this.prisma.capsule.create({
        data: {
          title: encrypt(dto.title, userId),
          ownerId: userId,
          message: encrypt(dto.message, userId),
          attachments,
          attachmentsSize: totalSizeGB,
          deliveryDate: dto.deliveryDate,
        },
      });

      const userUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          usedStorage: {
            increment: totalSizeGB
          }
        },
      });

      return {
        message: "Capsule created",
        newUsedStorage: userUpdated.usedStorage,
        capsule: {
          id: capsule.id,
          deliveryDate: capsule.deliveryDate,
          attachments: attachments.length
        }
      };

    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof HttpException ? error.message : 'Failed to create capsule',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(user: AuthedUser, page = 1, limit = 20) {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * limit;

      const totalDeliveredCaps = await this.prisma.capsule.count({ where: { ownerId: user.userId, delivered: true } })
      const totalPendingCaps = await this.prisma.capsule.count({ where: { ownerId: user.userId, delivered: false } })

      const delivered = await this.prisma.capsule.findMany({
        where: { ownerId: user.userId, delivered: true },
        skip,
        take: limit,
      })

      const pending = await this.prisma.capsule.findMany({
        where: { ownerId: user.userId, delivered: false },
        skip,
        take: limit,
      })

      delivered.forEach((cap) => {
        cap.title = decrypt(cap.title, user.userId);
        cap.message = decrypt(cap.message, user.userId);

        cap.attachments = (cap.attachments as Array<{ path: string }>).map((attachment) => ({
          ...attachment,
          path: decrypt(attachment.path, user.userId),
        }));
      });

      pending.forEach((cap) => {
        cap.title = "unavailable";
        cap.message = "unavailable";
        cap.attachments = { count: Array.isArray(cap.attachments) ? cap.attachments.length : 0 };
      });

      return {
        page,
        limit,
        totalDeliveredCaps,
        totalPendingCaps,
        size: { deliveredCaps: delivered.length, pendingCaps: pending.length },
        deliveredCaps: delivered,
        pendingCaps: pending,
      }
    } catch (error) {
      console.error('Failed to fetch capsules:', error);
      throw new Error('Failed to retrieve capsules');
    }
  }

  async findOne(id: string, user: AuthedUser) {
    try {
      if (!id) {
        throw new HttpException('capsule ID  is required', HttpStatus.BAD_REQUEST);
      }
      const capsule = await this.prisma.capsule.findFirst({
        where: {
          id,
          ownerId: user.userId,
        },
        include: {
          owner: true,
        },
      });

      if (!capsule) {
        throw new HttpException('Capsule not found', HttpStatus.NOT_FOUND)
      }
      if (capsule.delivered) {
        capsule.title = decrypt(capsule.title, user.userId)
        capsule.message = decrypt(capsule.message, user.userId)
        capsule.attachments = (capsule.attachments as Array<{ path: string }>).map((attachment) => ({
          ...attachment,
          path: decrypt(attachment.path, user.userId),
        }))

        await this.prisma.capsule.update({
          where: { id: id },
          data: {
            readCount: capsule.readCount + 1
          }
        })
      } else {
        capsule.title = "unavailable"
        capsule.message = "unavailable"
        capsule.attachments = { count: Array.isArray(capsule.attachments) ? capsule.attachments.length : 0 };
      }

      return { capsule };
    } catch (error) {
      console.error('Failed to fetch capsule', error)
      throw new HttpException(
        error instanceof HttpException ? error.message : 'Failed to create capsule',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, user: AuthedUser) {
    try {
      if (!id) {
        throw new HttpException('capsule ID  is required', HttpStatus.BAD_REQUEST);
      }
      const capsule = await this.prisma.capsule.findFirst({
        where: { id, ownerId: user.userId },
      });

      if (!capsule) {
        throw new HttpException('Capsule not found', HttpStatus.NOT_FOUND);
      }

      const decryptedAttachments = (capsule.attachments as Array<{ path: string }>).map((attachment) => ({
        ...attachment,
        path: decrypt(attachment.path, user.userId),
      }));

      for (const attachment of decryptedAttachments) {
        try {
          await this.S3Service.deleteFile(attachment.path);
        } catch (err: any) {
          if (err.code !== 'NoSuchKey' && err.name !== 'NotFound') {
            throw new HttpException('Failed to delete attachments', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      }

      await this.prisma.capsule.delete({
        where: { id },
      });

      const userUpdated = await this.prisma.user.update({
        where: { id: user.userId },
        data: {
          usedStorage: { increment: capsule.attachmentsSize },
        },
      });

      return {
        message: 'Capsule deleted successfully',
        capsule: {
          ...capsule,
          title: decrypt(capsule.title, user.userId),
          message: decrypt(capsule.message, user.userId),
          attachments: decryptedAttachments,
        },
        newStorage: userUpdated.usedStorage,
        recoveredStorage: capsule.attachmentsSize,
      };
    } catch (error) {
      console.error('Capsule deletion failed:', error);
      throw new HttpException(
        error instanceof HttpException ? error.message : 'Failed to create capsule',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
