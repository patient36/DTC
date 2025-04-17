import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

interface SubscriptionUser {
    id: string;
    stripeSubscriptionId: string;
    usedStorage: number;
    customerId: string;
    email: string;
}

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    constructor(private readonly prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async reportUsageForExpiringUsers(): Promise<void> {
        try {
            const users = await this.getExpiringSubscriptions();
            const results = await Promise.allSettled(
                users.map(user => this.reportUsageAndInvoice(user))
            );

            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    this.logger.error(`User ${users[index].id} failed:`, result.reason);
                }
            });
        } catch (error) {
            this.logger.error('Cron failed', error instanceof Error ? error.stack : error);
        }
    }

    private async getExpiringSubscriptions(): Promise<SubscriptionUser[]> {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + 3);

        const users = await this.prisma.user.findMany({
            where: {
                paidUntil: { lte: cutoff },
                subscriptionId: { not: null },
                usedStorage: { gt: 0 },
                customerId: { not: null },
            },
            select: {
                id: true,
                subscriptionId: true,
                usedStorage: true,
                email: true,
                customerId: true,
            },
        });

        return users.map(user => ({
            id: user.id,
            stripeSubscriptionId: user.subscriptionId!,
            usedStorage: user.usedStorage,
            email: user.email,
            customerId: user.customerId!,
        }));
    }

    private async reportUsageAndInvoice(user: SubscriptionUser): Promise<void> {
        try {
            const subscription = await this.stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
                expand: ['items.data.price.product'],
            });

            const storageItem = subscription.items.data.find(item => {
                const product = item.price.product as Stripe.Product;
                return product.metadata?.usage_type === 'storage';
            });

            if (!storageItem) {
                throw new Error(`No 'storage' item in subscription ${user.stripeSubscriptionId}`);
            }

            await (this.stripe.subscriptionItems as any).createUsageRecord(storageItem.id, {
                quantity: Math.round(user.usedStorage),
                timestamp: Math.floor(Date.now() / 1000),
                action: 'set',
            });

            this.logger.log(`Reported ${user.usedStorage}GB for user ${user.id}`);
        } catch (error) {
            this.logger.error(`Usage report failed for user ${user.id}`, error instanceof Error ? error.stack : error);
            throw error;
        }
    }

}
