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
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        this.priceId = process.env.STRIPE_PRICE_ID!;
    }

    async attachCard(body: AttachCardDto, user: AuthedUser) {
        const userInDb = await this.prisma.user.findUnique({
            where: { id: user.userId }
        });

        if (!userInDb) throw new NotFoundException('User not found');

        // Handle Stripe customer creation or retrieval
        let stripeCustomerId = userInDb.customerId;
        if (!stripeCustomerId) {
            const customer = await this.stripe.customers.create({
                email: userInDb.email,
                metadata: { userId: userInDb.id },
            });
            stripeCustomerId = customer.id;

            await this.prisma.user.update({
                where: { id: user.userId },
                data: { customerId: stripeCustomerId },
            });
        }

        // Attach payment method
        const paymentMethod = await this.stripe.paymentMethods.attach(
            body.paymentMethodId,
            { customer: stripeCustomerId }
        );

        // Set as default payment method
        await this.stripe.customers.update(stripeCustomerId, {
            invoice_settings: { default_payment_method: paymentMethod.id },
        });

        // Update user with payment method
        await this.prisma.user.update({
            where: { id: user.userId },
            data: { paymentMethodId: paymentMethod.id },
        });

        // Create subscription if doesn't exist
        if (!userInDb.subscriptionId) {
            const subscription = await this.stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [{ price: this.priceId }],
                default_payment_method: paymentMethod.id
            });

            await this.prisma.user.update({
                where: { id: user.userId },
                data: { subscriptionId: subscription.id },
            });
        }

        return paymentMethod;
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
                    await this.handlePaymentSuccess(event.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailure(event.data.object);
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

        await this.prisma.user.updateMany({
            where: { customerId: paymentIntent.customer },
            data: { paidUntil: null }
        });

        this.logger.warn(`Payment failed for customer ${paymentIntent.customer}`);
    }

    async attachCustomer(userId: string, email: string): Promise<string> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (user.customerId) return user.customerId;

        const customer = await this.stripe.customers.create({
            email,
            metadata: { userId },
        });

        const subscription = await this.stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: this.priceId }]
        })

        await this.prisma.user.update({
            where: { id: userId },
            data: { customerId: customer.id, subscriptionId: subscription.id },
        });

        return customer.id;
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

        await this.stripe.customers.del(user.customerId);

        if (!user.subscriptionId) return;

        await this.stripe.subscriptions.update(user.subscriptionId, { cancel_at_period_end: true });

        await this.prisma.user.update({
            where: { id: userId },
            data: { customerId: null, subscriptionId: null },
        });
    }

}