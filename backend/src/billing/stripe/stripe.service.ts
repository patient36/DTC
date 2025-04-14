import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private readonly prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    }

    async manualPayment(customerId: string, amount: number, currency = 'usd') {
        return await this.stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            payment_method_types: ['card'],
        });
    }

    async autoPayment(customerId: string, amount: number, paymentMethodId: string, currency = 'usd') {
        return await this.stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
        });
    }

    handleWebhook(rawBody: Buffer, sig: string) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        } catch (err) {
            throw new Error(`Webhook Error: ${(err as Error).message}`);
        }

        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent for ${paymentIntent.amount} succeeded`);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return { received: true };
    }

    async attachCustomer(userId: string, email: string): Promise<string> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (user.stripeCustomerId) return user.stripeCustomerId;

        const customer = await this.stripe.customers.create({
            email,
            metadata: { userId },
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customer.id },
        });

        return customer.id;
    }

    async syncCustomerEmail(userId: string, email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.stripeCustomerId) return;

        const customer = await this.stripe.customers.retrieve(user.stripeCustomerId);
        if (
            typeof customer === 'object' &&
            'email' in customer &&
            customer.email !== email
        ) {
            await this.stripe.customers.update(user.stripeCustomerId, { email });
        }
    }

    async deleteCustomer(userId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.stripeCustomerId) return;

        await this.stripe.customers.del(user.stripeCustomerId);

        await this.prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: null },
        });
    }

}