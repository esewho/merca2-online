import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ApiConnection } from 'src/utils/api-connection.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, ApiConnection],
  exports: [CategoriesService],
})
export class CategoriesModule {}
