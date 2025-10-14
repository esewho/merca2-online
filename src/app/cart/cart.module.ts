import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ApiConnection } from 'src/utils/api-connection.service';

@Module({
  controllers: [CartController],
  providers: [CartService, ApiConnection],
  exports: [CartService],
})
export class CartModule {}
