import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

interface SubscriptionUser {
    id: string;
    subscriptionId: string;
    usedStorage: number;
    customerId: string;
    email: string;
}

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-03-31.basil',
    });

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
                usedStorage: { gt: -0.1 },
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
            subscriptionId: user.subscriptionId!,
            usedStorage: user.usedStorage,
            email: user.email,
            customerId: user.customerId!,
        }));
    }

    private async reportUsageAndInvoice(user: SubscriptionUser): Promise<void> {
        const maxRetries = 5;
        const retryDelay = 1500;

        const makeRequest = async (retries: number): Promise<void> => {
            this.logger.log(`Attempting report usage for ${user.id}, Retries left: ${retries}`);

            try {
                await this.stripe.billing.meterEvents.create({
                    event_name: 'DTC-STORAGE-EVENT',
                    timestamp: Math.floor(Date.now() / 1000),
                    payload: {
                        value: `${Math.max(0, parseFloat(user.usedStorage.toFixed(6)))}`,
                        stripe_customer_id: user.customerId,
                    },
                });

                this.logger.log(`Successfully reported ${user.usedStorage}GB for ${user.id}`);
            } catch (error) {
                if (retries > 0) {
                    const delay = retryDelay * Math.pow(2, maxRetries - retries);
                    this.logger.warn(`Retrying usage report for ${user.id}. Retries left: ${retries}. Next retry in ${delay}ms`);

                    await new Promise(resolve => setTimeout(resolve, delay));

                    await makeRequest(retries - 1);
                } else {
                    this.logger.error(`Usage report failed for ${user.id}`, {
                        error: error instanceof Error ? error.message : String(error),
                        subscriptionId: user.subscriptionId,
                        stack: error instanceof Error ? error.stack : undefined,
                    });

                    throw error;
                }
            }
        };

        await makeRequest(maxRetries);
    }
}
