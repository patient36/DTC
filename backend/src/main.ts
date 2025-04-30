import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './common/filters/exception.filters';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { seedAdmin } from './prisma/seed';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/api/v1/payment/card/webhook', express.raw({ type: 'application/json' }));
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
      if (!origin || origin === process.env.CLIENT_URL) {
        callback(null, true);
      }
      else if (origin === process.env.STRIPE_WEBHOOK_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'), false);
      }
    },
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Set-Cookie'],
  } as CorsOptions);


  app.use(cookieParser());
  await seedAdmin()
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
