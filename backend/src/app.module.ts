import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { MailService } from './mail/mail.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CapsulesModule } from './capsules/capsules.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, CapsulesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule { }
