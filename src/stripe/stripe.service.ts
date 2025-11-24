import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_API_KEY!);

  async createPaymentIntent(amount: number, currency: 'eur' | 'usd') {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}
