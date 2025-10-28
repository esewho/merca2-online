/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/dtos/category.dto';
import { ProductDto } from 'src/dtos/product.dto';

@Injectable()
export class ApiConnection {
  static readonly API_URL =
    process.env.API_URL || 'https://api.escuelajs.co/api/v1';

  async findAllProducts(params: {
    title?: string;
    price_min?: number;
    price?: number;
    price_max?: number;
    categoryId?: number;
    limit?: number;
    offset?: number;
  }): Promise<ProductDto[]> {
    const { title, price_min, price_max, categoryId, limit, offset, price } =
      params;

    const query = new URLSearchParams({
      ...(title ? { title } : {}),
      ...(price_min ? { price_min: price_min.toString() } : {}),
      ...(price ? { price: price.toString() } : {}),
      ...(price_max ? { price_max: price_max.toString() } : {}),
      ...(categoryId ? { categoryId: categoryId.toString() } : {}),
      ...(limit ? { limit: limit.toString() } : {}),
      ...(offset ? { offset: offset.toString() } : {}),
    });
    console.log(categoryId, 'categoryId in api-connection');
    console.log(query);
    const response = await fetch(`${ApiConnection.API_URL}/products?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products from external API');
    }
    const data = await response.json();
    return data;
  }
  async findProductById(id: string): Promise<ProductDto | null> {
    const response = await fetch(`${ApiConnection.API_URL}/products/${id}`);
    console.log(response, 'response in findProductById');
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      console.log(response);
      throw new Error('Failed to fetch product from external API');
    }
    const data = await response.json();
    return data;
  }

  async findAllCategories(): Promise<CategoryDto[]> {
    const response = await fetch(`${ApiConnection.API_URL}/categories`);
    if (response.status === 404) {
      throw new Error('Category not found');
    }
    if (!response.ok) {
      console.log(response);
      throw new Error('Failed to fetch categories from external API');
    }
    const data = await response.json();
    return data;
  }
}
