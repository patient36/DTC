import { Module } from '@nestjs/common';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { BillingService } from './billing.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [StripeController],
  providers: [StripeService, BillingService],
})
export class BillingModule { }
