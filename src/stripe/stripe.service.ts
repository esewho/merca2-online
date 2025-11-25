import { Injectable } from '@nestjs/common';
import { StripeItemDto } from 'src/dtos/stripe-item.dto';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  async createCheckoutSession(items: StripeItemDto[]) {
    console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: [item.imageUrl],
          },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      success_url: 'https://your-domain.com/success',
      cancel_url: 'https://your-domain.com/cancel',
    });
    return { url: session.url };
  }
}
