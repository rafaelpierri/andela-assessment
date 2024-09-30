import { Module } from '@nestjs/common';
import { ProductService } from './application/product.service';
import { ProductController } from './presentation/product.controller';
import { OrderService } from './application/order.service';
import { OrderController } from './presentation/order.controller';

@Module({
  controllers: [OrderController, ProductController],
  providers: [OrderService, ProductService],
})
export class ProductCatalogModule {}
