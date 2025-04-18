import { Module } from '@nestjs/common';
import { CapsulesService } from './capsules.service';
import { CapsulesController } from './capsules.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Module } from 'src/s3/s3.module';
import { DeliveryTasksService } from 'src/tasks/delivery.task.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [S3Module, ScheduleModule.forRoot(),],
  controllers: [CapsulesController],
  providers: [CapsulesService, PrismaService, DeliveryTasksService],
})
export class CapsulesModule { }
