import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  // UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';
import { ChangeQtyDto } from 'src/dtos/change-qty.dto';
import { AddToCartDto } from 'src/dtos/add-to-cart.dto';

// @UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  async getCart(@UserId() userId: string) {
    return this.cart.getCartWithItems(userId);
  }

  @Post('items')
  async addItem(@UserId() userId: string, @Body() dto: AddToCartDto) {
    return await this.cart.addProductToCart(
      userId,
      dto.externalId,
      dto.quantity,
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
