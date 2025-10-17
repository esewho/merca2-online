import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiConnection } from 'src/utils/api-connection.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiService: ApiConnection,
  ) {}

  async findAll(params: {
    title?: string;
    categoryId?: string;
    price_min?: number;
    price?: number;
    price_max?: number;
    limit: number;
    offset: number;
  }) {
    const { categoryId, price_min, price_max, limit, offset, title, price } =
      params;

    const apiProducts = await this.apiService.findAllProducts({
      title,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      price_min,
      price,
      price_max,
      limit,
      offset,
    });

    if (!apiProducts || apiProducts.length === 0) {
      throw new Error('No products found from external API');
    }
    return apiProducts;
  }

  async findOne(id: string) {
    const product = await this.apiService.findProductById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }
}
