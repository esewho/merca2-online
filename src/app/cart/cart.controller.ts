import { Controller } from '@nestjs/common';

@Controller('cart')
export class CartController {
  constructor() {}

  async getUserCart(userId: string, cartId: string) {}
}
