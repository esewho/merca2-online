import { Controller, Post, Body, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeItemDto } from 'src/dtos/stripe-item.dto';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Req() req,
    @Body('items') items: StripeItemDto[],
  ) {
    console.log(
      'Received items for checkout session: ========================================================',
      items,
    );
    return await this.stripeService.createCheckoutSession(items);
  }
}
