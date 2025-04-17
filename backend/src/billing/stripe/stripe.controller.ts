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
import { CurrentUser } from 'src/common/decorators/currentUser';
import { AuthedUser } from 'src/common/types/currentUser';
import { AttachCardDto } from '../dto/attach-card.dto';


@Controller('payment/card')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('default')
    async attachCard(@Body() body: AttachCardDto, @CurrentUser() user: AuthedUser) {
        return this.stripeService.attachCard(body, user);
    }

    @Public()
    @Post('webhook')
    webhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') sig: string,
    ) {
        if (!req.rawBody) throw new Error('Missing raw body');

        return this.stripeService.handleWebhook(req.rawBody, sig);
    }
}