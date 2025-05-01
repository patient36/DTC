import { Module } from '@nestjs/common';
import { CapsulesService } from './capsules.service';
import { CapsulesController } from './capsules.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Module } from 'src/s3/s3.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [S3Module],
  controllers: [CapsulesController],
  providers: [CapsulesService, PrismaService, MailService],
  exports: [CapsulesService],
})
export class CapsulesModule { }
