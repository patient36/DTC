import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CapsulesService } from '../capsules/capsules.service';

@Injectable()
export class DeliveryTasksService {
    private readonly logger = new Logger(DeliveryTasksService.name);

    constructor(private readonly capsulesService: CapsulesService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCapsuleDelivery() {
        this.logger.log('Running capsule delivery check...');

        try {
            const result = await this.capsulesService.markDueCapsulesAsDelivered();
            console.log(`Marked ${result.count} capsules as delivered`);
        } catch (error) {
            console.error('Failed to update capsule deliveries', error.stack);
        }
    }
}