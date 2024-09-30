import { Module } from '@nestjs/common';
import { OrderProcessingModule } from './order-processing/order-processing.module';
import { ProductCatalogModule } from './product-catalog/product-catalog.module';


@Module({
  imports: [
    ProductCatalogModule,
    OrderProcessingModule
  ],
})
export class InventoryManagementModule {}