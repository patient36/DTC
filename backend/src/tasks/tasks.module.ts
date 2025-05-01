import { Module } from '@nestjs/common';
import { CapsulesModule } from 'src/capsules/capsules.module';
import { TasksService } from './tasks.service';

@Module({
    imports: [CapsulesModule],
    controllers: [],
    providers: [TasksService],
    exports: [],
})
export class TasksModule {}
