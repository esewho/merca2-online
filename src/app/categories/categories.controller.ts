import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly category: CategoriesService) {}
  @Get()
  async findAll() {
    return await this.category.findAll();
  }
}
