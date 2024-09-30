import { Module } from '@nestjs/common';
import { ProductService } from './application/product.service';
import { ProductController } from './presentation/product.controller';
import { OrderService } from './application/order.service';
import { OrderController } from './presentation/order.controller';
import { ProductRepository } from './domain/product.repository';
import { ProductTable } from './infrastructure/product.table';

@Module({
  controllers: [OrderController, ProductController],
  providers: [OrderService, ProductService, {
    provide: ProductRepository,
    useClass: ProductTable
  }],
})
export class ProductCatalogModule {}
