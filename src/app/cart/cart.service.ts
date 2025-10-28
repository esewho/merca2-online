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
      create: { user: { connect: { id: userId } } },
      update: {},
    });
  }

  async getCartWithItems(userId: string) {
    const cart = await this.getCartByUserId(userId);
    console.log(cart.id, 'aqui esta el carrito del usuario!!!!');
    return this.prismaService.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: { include: { product: { include: { category: true } } } },
      },
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
    const images = apiProduct.images ?? undefined;

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
          images: {
            set: images,
          },
          categoryId: category.id,
        },
        update: {
          name,
          description,
          price,
          images: {
            set: images,
          },
          categoryId: category.id,
        },
      });
      await tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: product.id } },
        create: {
          cartId: cart.id,
          productId: product.id,
          quantity,
        },
        update: { quantity: { increment: quantity } },
      });

      return await tx.cart.update({
        where: { id: cart.id },
        data: {},
      });
    });
    return updatedCart;
  }

  async removeProductFromCart(
    userId: string,
    productId: string,
    quantity?: number,
  ) {
    const cart = await this.getCartByUserId(userId);
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    const cartItem = await this.prismaService.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });
    if (!cartItem) {
      throw new Error('Product not in cart');
    }
    if (!quantity || quantity <= 0) {
      return await this.prismaService.cartItem.delete({
        where: { id: cartItem.id },
      });
    }
    if (quantity < cartItem.quantity) {
      const updatedCart = await this.prismaService.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity - quantity },
      });
      return updatedCart;
    } else {
      return await this.prismaService.cartItem.delete({
        where: { id: cartItem.id },
      });
    }
  }

  async clearCart(userId: string) {
    const cart = await this.getCartByUserId(userId);
    const updateCart = await this.prismaService.cart.update({
      where: { id: cart.id },
      data: { items: { deleteMany: {} } },
    });
    return updateCart;
  }
}
