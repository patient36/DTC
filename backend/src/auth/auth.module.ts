import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { StripeService } from 'src/billing/stripe/stripe.service';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, StripeService],
  controllers: [AuthController],
})
export class AuthModule { }
