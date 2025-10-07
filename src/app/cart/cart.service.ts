import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiConnection } from 'src/utils/api-connection.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly apiService: ApiConnection,
  ) {}
  async getCartByUserId(userId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      return await this.prismaService.cart.create({
        data: { userId, total: 0 },
      });
    } else {
      return cart;
    }
  }

  async addProductToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCartByUserId(userId);
    const product = await this.apiService.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    const totalToAdd = product.price * quantity;
    const updateCart = await this.prismaService.cart.update({
      where: { id: cart.id },
      data: { total: cart.total + totalToAdd },
    });
    return updateCart;
  }

  async removeProductFromCart(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const cart = await this.getCartByUserId(userId);
    const product = await this.apiService.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (quantity <= 0) {
      throw new Error('You cant remove a negative quantity');
    }
    const totalToRemove = product.price * quantity;
    if (cart.total - totalToRemove < 0) {
      throw new Error('You cant remove more than the cart total');
    }
    const updateCart = await this.prismaService.cart.update({
      where: { id: cart.id },
      data: { total: cart.total - totalToRemove },
    });
    return updateCart;
  }

  async clearCart(userId: string) {
    const cart = await this.getCartByUserId(userId);
    const updateCart = await this.prismaService.cart.update({
      where: { id: cart.id },
      data: { total: 0 },
    });
    return updateCart;
  }
}
