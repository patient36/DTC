import { Injectable } from '@nestjs/common';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { S3Service } from 'src/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapsulesService {
  constructor(private readonly prisma: PrismaService, private readonly S3Service: S3Service) { }
  async create(dto: CreateCapsuleDto, files: Express.Multer.File[]) {
    if (!files?.length) return { dto, attachments: [] };

    const attachments = await Promise.all(
      files.map(async (file) => {
        const path = await this.S3Service.uploadFile(file);
        return { path, size: file.size };
      })
    );

    const totalSize = attachments.reduce((sum, file) => sum + file.size, 0);

    return { dto, attachments, totalSize };
  }


  findAll() {
    return `This action returns all capsules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} capsule`;
  }

  remove(id: number) {
    return `This action removes a #${id} capsule`;
  }
}
