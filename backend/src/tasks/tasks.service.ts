import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CapsulesService } from '../capsules/capsules.service';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(private readonly capsulesService: CapsulesService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCapsuleDelivery() {
        this.logger.log('Running capsule delivery check...');

        try {
            const result = await this.capsulesService.markDueCapsulesAsDelivered();
            const { count } = result || { count: 0 };
            console.log(`Marked ${count} capsules as delivered`);
        } catch (error) {
            console.error('Failed to update capsule deliveries', error.stack);
        }
    }
}