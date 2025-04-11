import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [PrismaModule, MailModule, S3Module],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
