import { Module } from '@nestjs/common';
import { OrderService } from './application/order.service';
import { OrderController } from './presentation/order.controller';
import { ProductRepository } from '../product-catalog/domain/product.repository';
import { ProductTable } from '../product-catalog/infrastructure/product.table';

@Module({
  controllers: [OrderController],
  providers: [OrderService, {
    provide: ProductRepository,
    useClass: ProductTable
  }],
})
export class OrderProcessingModule {}
