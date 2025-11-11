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
    console.log(userId, 'aqui esta el userId del carrito!!!!');
    if (!userId) {
      throw new Error('User not authenticated');
    }
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

  async changeQuantity(userId: string, productId: string, quantity?: number) {
    if (quantity === undefined || quantity < 0) {
      console.log(quantity, '------------------------');
      throw new Error('Quantity must be a non-negative number');
    }
    const cart = await this.getCartByUserId(userId);

    return this.prismaService.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
      if (!cartItem) {
        await tx.cartItem.upsert({
          where: { cartId_productId: { cartId: cart.id, productId } },
          create: {
            cartId: cart.id,
            productId,
            quantity,
          },
          update: { quantity: { set: quantity } },
        });
        return;
      }

      if (quantity === 0) {
        // borrar línea entera
        await tx.cartItem.delete({ where: { id: cartItem.id } });
      } else {
        // actualizar unidades
        await tx.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: { increment: 1 } },
        });
      }

      // recalcular total
      const calculateCartTotal = async (cartId: string) => {
        const items = await tx.cartItem.findMany({
          where: { cartId },
          include: { product: true },
        });
        return items.reduce(
          (total, item) => total + item.quantity * item.product.price,
          0,
        );
      };

      return tx.cart.update({
        where: { id: cart.id },
        data: { total: { set: await calculateCartTotal(cart.id) } },
      });
    });
  }

  async removeProductFromCart(
    userId: string,
    productIdOrExternalId: string,
    quantity?: number,
  ) {
    const cart = await this.getCartByUserId(userId);

    // ⬇️ Buscar por id local O por externalId
    const product = await this.prismaService.product.findFirst({
      where: {
        OR: [
          { id: productIdOrExternalId },
          { externalId: productIdOrExternalId },
        ],
      },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    return this.prismaService.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId: product.id } },
      });
      if (!cartItem) throw new Error('Product not in cart');

      if (!quantity || quantity <= 0 || quantity >= cartItem.quantity) {
        // borrar línea entera
        await tx.cartItem.delete({ where: { id: cartItem.id } });
      } else {
        // decrementar unidades
        await tx.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity - quantity },
        });
      }

      // recalcular total

      return tx.cart.update({
        where: { id: cart.id },
        data: {},
        include: { items: { include: { product: true } } },
      });
    });
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
