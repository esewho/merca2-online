import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ApiConnection } from 'src/utils/api-connection.service';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService, ApiConnection],
})
export class ProductsModule {}
