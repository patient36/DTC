import {
    Controller,
    Post,
    Body,
    Headers,
    Req,
    RawBodyRequest,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('payment/card')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('manual')
    manualPayment(@Body() body: { customerId: string; amount: number }) {
        return this.stripeService.manualPayment(body.customerId, body.amount);
    }

    @Post('auto')
    autoPayment(@Body() body: { customerId: string; amount: number; paymentMethodId: string }) {
        return this.stripeService.autoPayment(
            body.customerId,
            body.amount,
            body.paymentMethodId,
        );
    }

    @Post('webhook')
    webhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') sig: string,
    ) {
        if (!req.rawBody) throw new Error('Missing raw body');

        return this.stripeService.handleWebhook(req.rawBody, sig);
    }
}