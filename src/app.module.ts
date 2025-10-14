import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './app/categories/categories.module';
import { AuthModule } from './app/auth/auth.module';
import { ProductsModule } from './app/products/products.module';
import { CartModule } from './app/cart/cart.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    AuthModule,
    ProductsModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
