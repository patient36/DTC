import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { AttachCardDto } from '../dto/attach-card.dto';
import { AuthedUser } from 'src/common/types/currentUser';
import { WebhookResponse } from './types';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private priceId: string;
    private readonly logger = new Logger(StripeService.name)


    constructor(private readonly prisma: PrismaService, private readonly MailService: MailService) {
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
                name: user.name,
                description: 'DTC Storage customer',
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
                if (subscription.status !== 'active') {
                    subscriptionId = null;
                }
            } catch {
                subscriptionId = null;
            }
        }

        if (!subscriptionId) {
            subscription = await this.stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: this.priceId }],
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
        await this.MailService.sendEmail('example@mail.com', '', '')
        try {
            event = this.stripe.webhooks.constructEvent(
                rawBody,
                sig,
                endpointSecret
            );
        } catch (err) {
            this.logger.error('Webhook verification failed', err);
            throw new Error('Webhook verification failed');
        }

        switch (event.type) {
            case 'invoice.payment_succeeded':
                this.handleSuccessfulPayment(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                this.handleFailedPayment(event.data.object as Stripe.Invoice);
                break;

            default:
                this.logger.warn(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
    }

    private async handleSuccessfulPayment(invoice: Stripe.Invoice) {
        const customerId = invoice.customer as string;
        const subscriptionId = invoice.metadata?.subscriptionId || null;
        this.logger.log(`Payment succeeded for customer ${customerId}`);
        const user = await this.prisma.user.findUnique({ where: { customerId } })
        if (!user) {
            throw new NotFoundException('User not found for the given customer ID');
        }

        const payment = await this.prisma.payment.create({
            data: {
                payerId: user.id,
                paymentId: invoice.id || '',
                description: invoice.description || '',
                status: "COMPLETED",
            }
        })
        return { message: 'Payment successful' }
    }

    private async handleFailedPayment(invoice: Stripe.Invoice) {
        const customerId = invoice.customer as string;

        const user = await this.prisma.user.findUnique({ where: { customerId } })
        if (!user) {
            // cancel this subscription and delete customer
        }

        try {
            // mail user that we cant reach their card
        } catch (error) {
            this.logger.warn(error)
        }
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