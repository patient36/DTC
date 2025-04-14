import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from 'src/mail/mail.module';
import { S3Module } from 'src/s3/s3.module';
import { StripeService } from 'src/billing/stripe/stripe.service';

@Module({
  imports: [MailModule, S3Module],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, StripeService],
})
export class UsersModule { }
