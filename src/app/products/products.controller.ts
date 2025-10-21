import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async findAll(
    @Query('title') title?: string,
    @Query('price_min') price_min?: number,
    @Query('price') price?: number,
    @Query('price_max') price_max?: number,
    @Query('categoryId') categoryId?: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return await this.productsService.findAll({
      title,
      categoryId,
      price_min,
      price,
      price_max,
      limit,
      offset,
    });
  }

  @Get(':id')
  async findById(@Param('externalId') id: string) {
    return await this.productsService.findOne(id);
  }
}
