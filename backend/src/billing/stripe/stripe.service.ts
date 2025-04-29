import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { AttachCardDto } from '../dto/attach-card.dto';
import { AuthedUser } from 'src/common/types/currentUser';
import { WebhookResponse } from './types';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private priceId: string;
    private readonly logger = new Logger(StripeService.name)


    constructor(private readonly prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-03-31.basil',
        });
        this.priceId = process.env.STRIPE_PRICE_ID!;
    }

    async attachCard(body: AttachCardDto, AuthedUser: AuthedUser) {
        const user = await this.prisma.user.findUnique({
            where: { id: AuthedUser.userId }
        });

        if (!user) throw new NotFoundException('User not found');
        // 1.Create customer
        let customerId = user.customerId;
        if (customerId) {
            try {
                const customer = await this.stripe.customers.retrieve(customerId);
                if (customer.deleted) {
                    customerId = null;
                }
            } catch (error) {
                customerId = null;
            }
        }
        if (!customerId) {
            const customer = await this.stripe.customers.create({
                email: user.email,
                metadata: { userId: user.id }
            })
            customerId = customer.id;
            await this.prisma.user.update({
                where: { id: AuthedUser.userId },
                data: { customerId }
            });
        }

        // 2.Attach payment method
        await this.stripe.paymentMethods.attach(body.paymentMethodId, {
            customer: customerId
        });

        // 3.Set default payment method
        await this.stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: body.paymentMethodId
            }
        })

        // 4.Create subscription
        let subscriptionId = user.subscriptionId;
        let subscription: Stripe.Subscription | null = null;

        if (subscriptionId) {
            try {
                subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
                if(subscription.status !== 'active'){
                    subscriptionId = null;
                }
            } catch {
                subscriptionId = null;
            }
        }

        if (!subscriptionId) {
            subscription = await this.stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: this.priceId}],
                payment_behavior: 'default_incomplete',
                expand: ['latest_invoice'],
            });

            subscriptionId = subscription.id;

            await this.prisma.user.update({
                where: { id: AuthedUser.userId },
                data: { subscriptionId },
            });
        }

        const paymentIntent = (subscription?.latest_invoice as any)?.payment_intent as Stripe.PaymentIntent | undefined;

        return { clientSecret: paymentIntent?.client_secret || null };

    }

    async handleWebhook(rawBody: Buffer, sig: string): Promise<WebhookResponse> {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!endpointSecret) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
        }

        let event: Stripe.Event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        } catch (err) {
            this.logger.error('Webhook verification failed', err);
            return { received: false, message: 'Invalid signature' };
        }

        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    console.log('PaymentIntent was successful!');
                    // await this.handlePaymentSuccess(event.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    console.log('PaymentIntent failed!');
                    // await this.handlePaymentFailure(event.data.object);
                    break;
                default:
                    this.logger.debug(`Unhandled event type: ${event.type}`);
            }
            return { received: true };
        } catch (error) {
            this.logger.error(`Webhook processing failed: ${error}`);
            return { received: false, message: 'Processing failed' };
        }
    }

    private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        if (typeof paymentIntent.customer !== 'string') {
            throw new Error('Invalid customer ID in payment intent');
        }

        const userId = paymentIntent.metadata?.userId;
        if (!userId) {
            throw new Error('Missing user ID in payment metadata');
        }

        await this.prisma.$transaction(async (tx) => {
            // Record payment
            await tx.payment.create({
                data: {
                    payerId: userId,
                    paymentId: paymentIntent.id,
                    amount: paymentIntent.amount / 100,
                    status: 'COMPLETED',
                    description: paymentIntent.description || 'Storage payment'
                }
            });

            // Update user access
            await tx.user.update({
                where: { id: userId },
                data: {
                    paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
                }
            });
        });

        this.logger.log(`Processed successful payment ${paymentIntent.id}`);
    }

    private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        if (typeof paymentIntent.customer !== 'string') {
            throw new Error('Invalid customer ID in failed payment');
        }

        // mail payer

        this.logger.warn(`Payment failed for customer ${paymentIntent.customer}`);
    }

    async syncCustomerEmail(userId: string, email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.customerId) return;

        const customer = await this.stripe.customers.retrieve(user.customerId);
        if (
            typeof customer === 'object' &&
            'email' in customer &&
            customer.email !== email
        ) {
            await this.stripe.customers.update(user.customerId, { email });
        }
    }

    async deleteCustomer(userId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.customerId) return;

        try {
            if (user.subscriptionId) {
                const subscription = await this.stripe.subscriptions.retrieve(user.subscriptionId);

                if (subscription.status === 'active') {
                    await this.stripe.subscriptions.update(user.subscriptionId, {
                        cancel_at_period_end: true
                    });
                } else {
                    await this.stripe.subscriptions.cancel(user.subscriptionId);
                }
            }

            await this.stripe.customers.del(user.customerId);

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    customerId: null,
                    subscriptionId: null,
                },
            });
        } catch (error) {
            console.error('Error deleting Stripe customer:', error);
            throw error;
        }
    }

}