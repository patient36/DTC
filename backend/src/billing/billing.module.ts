import { Module } from '@nestjs/common';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { BillingService } from './billing.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, MailModule, ScheduleModule.forRoot()],
  controllers: [StripeController],
  providers: [StripeService, BillingService],
})
export class BillingModule { }
