import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: 'eur' | 'usd',
  ) {
    return await this.stripeService.createPaymentIntent(amount, currency);
  }
}
