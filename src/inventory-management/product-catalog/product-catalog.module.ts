import { Module } from '@nestjs/common';
import { ProductService } from './application/product.service';
import { ProductController } from './presentation/product.controller';
import { ProductRepository } from './domain/product.repository';
import { ProductTable } from './infrastructure/product.table';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: ProductTable,
    },
  ],
})
export class ProductCatalogModule {}
