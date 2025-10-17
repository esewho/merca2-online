import { Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/dtos/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiConnection } from 'src/utils/api-connection.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly api: ApiConnection,
    private readonly prisma: PrismaService,
  ) {}
  async findAll(): Promise<CategoryDto[]> {
    return await this.api.findAllCategories();
  }
}
