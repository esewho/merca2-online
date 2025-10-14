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
    return await this.prismaService.cart.upsert({
      where: { userId },
      create: { user: { connect: { id: userId } }, total: 0 },
      update: {},
    });
  }

  async getCartWithItems(userId: string) {
    const cart = await this.getCartByUserId(userId);
    console.log(cart.id, 'aqui esta el carrito del usuario!!!!');
    return this.prismaService.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
  }

  async addProductToCart(userId: string, externalId: string, quantity: number) {
    if (quantity <= 0) {
      throw new Error('You cant add a negative quantity');
    }
    const cart = await this.getCartByUserId(userId);
    const apiProduct = await this.apiService.findProductById(externalId);
    if (!apiProduct) {
      throw new Error('Product not found');
    }
    const categoryName = String(apiProduct.category.name ?? 'Otros');
    const name = apiProduct.title ?? 'Producto';
    const description = apiProduct.description ?? '';
    const price = apiProduct.price ?? 0;
    const image = apiProduct.image ?? '';

    const updatedCart = await this.prismaService.$transaction(async (tx) => {
      const category = await tx.category.upsert({
        where: { name: categoryName },
        create: { name: categoryName },
        update: {},
      });

      const product = await tx.product.upsert({
        where: { externalId },
        create: {
          name,
          externalId,
          description,
          price,
          image: image,
          categoryId: category.id,
        },
        update: {
          name,
          description,
          price,
          image: image,
          categoryId: category.id,
        },
      });
      await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: product.id } },
        create: {
          cartId: cart.id,
          productId: product.id,
          quantity,
          price: product.price,
        },
        update: { quantity: { increment: quantity } },
      });
      const items = await tx.cartItem.findMany({
        where: { cartId: cart.id },
        select: { price: true, quantity: true },
      });
      const newTotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return await tx.cart.update({
        where: { id: cart.id },
        data: { total: newTotal },
      });
    });
    return updatedCart;
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
