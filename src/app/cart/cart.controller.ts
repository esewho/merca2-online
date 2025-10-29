import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { ChangeQtyDto } from 'src/dtos/change-qty.dto';
import { AddToCartDto } from 'src/dtos/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  async getCart(@UserId() userId: string) {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.cart.getCartWithItems(userId);
  }

  @Put('items/:productId/increment')
  increment(
    @UserId() userId: string, // o @GuestId si vas sin login
    @Param('productId') productId: string,
    @Body() dto: { quantity?: number },
  ) {
    const qty = dto.quantity ?? 1;
    return this.cart.changeQuantity(userId, productId, +qty);
  }

  @Put('items/:productId/decrement')
  decrement(
    @UserId() userId: string,
    @Param('productId') productId: string,
    @Body() dto: { quantity?: number },
  ) {
    const qty = Math.max(1, dto.quantity ?? 1);

    return this.cart.changeQuantity(userId, productId, qty);
  }

  @Post('items')
  async addItem(@UserId() userId: string, @Body() dto: AddToCartDto) {
    return await this.cart.addProductToCart(
      userId,
      dto.externalId,
      dto.quantity ? dto.quantity : 1,
    );
  }

  @Put('items/:productId')
  async removeItem(
    @UserId() userId: string,
    @Param('productId') productId: string,
    @Body() dto: ChangeQtyDto,
  ) {
    return await this.cart.removeProductFromCart(
      userId,
      productId,
      dto.quantity,
    );
  }

  @Delete()
  async clearCart(@UserId() userId: string) {
    return await this.cart.clearCart(userId);
  }
}
