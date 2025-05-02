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
                description: 'Monthly fee for DTC Storage',
                status: "COMPLETED",
                amount: invoice.amount_paid || 0,
            }
        })
        const body = `
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 6px;">
                <tr>
                    <td>
                        <h2 style="color: #2a9d8f;">Payment Successful</h2>
                        <p>Hi ${user.name},</p>
                        <p>We are pleased to inform you that your payment for this month on DTC was successful!</p>
                        <p>Your service will continue without any interruption.</p>
                        <strong>Thank you for being a valued customer!</strong><br>
                        <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #2a9d8f; color: #ffffff; text-decoration: none; border-radius: 4px;">Visit your dashboard</a>
                        <p style="margin-top: 30px; font-size: 12px; color: #888;">If you have any questions, feel free to reach out to our support team.</p>
                        <p style="margin-top: 30px; font-size: 12px; color: #888;">A record of this payment with an ID of ${payment.id} has been created and you can find it in your dashboard.</p>
                    </td>
                </tr>
            </table>
        </body>`
        
        await this.MailService.sendEmail(user.email, "Payment Successful", body);
        return { message: 'Payment successful' }
    }

    private async handleFailedPayment(invoice: Stripe.Invoice) {
        const customerId = invoice.customer as string;

        const user = await this.prisma.user.findUnique({ where: { customerId } })
        if (!user) {
            throw new NotFoundException('User not found for the given customer ID');
        }

        try {
            const payment = await this.prisma.payment.create({
                data: {
                    payerId: user.id,
                    paymentId: invoice.id || '',
                    description: 'Monthly fee for DTC Storage',
                    status: "FAILED",
                    amount: invoice.amount_paid || 0,
                }
            })
            const body = `
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 6px;">
                    <tr>
                    <td>
                        <h2 style="color: #e63946;">Payment Failed</h2>
                        <p>Hi ${user.name},</p>
                        <p>Your payment for this month on DTC was not successful.</p>
                        <p>Please update your payment method to avoid interruption of service.</p>
                        <strong>Login your account to update your payment method</strong>
                        <a href="${process.env.CLIENT_URL}/payment" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 4px;">If you are already logged in click here</a>
                        <p style="margin-top: 30px; font-size: 12px; color: #888;">If you've already resolved this, you can ignore this email. A reocrd of a failed payment with an ID of ${payment.id} has been created and you cna find it in your dashboard.</p>
                    </td>
                    </tr>
                </table>
            </body>`
            await this.MailService.sendEmail(user.email, "Payment Failed", body);
            this.logger.log(`Payment failed for customer ${customerId}`);
            return { message: 'Payment failed' }
        } catch (error) {
            this.logger.warn(error)
        }
    }

    async syncCustomerData(userId: string, email: string, name: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.customerId) return;

        const customer = await this.stripe.customers.retrieve(user.customerId);
        if (typeof customer !== 'object' || (customer as any).deleted) return;

        const updates: { email?: string; name?: string } = {};

        if ('email' in customer && customer.email !== email) {
            updates.email = email;
        }

        if ('name' in customer && customer.name !== name) {
            updates.name = name;
        }

        if (Object.keys(updates).length) {
            await this.stripe.customers.update(user.customerId, updates);
        }
    }

    async deleteCustomer(userId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.customerId) return;

        try {
            const customer = await this.stripe.customers.retrieve(user.customerId);
            if (!customer || (customer as any).deleted) return;

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