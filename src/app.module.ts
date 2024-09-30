import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { AppDataSource } from '../data-source';
import { ProductRow } from './inventory-management/product-catalog/infrastructure/product.row';
import { InventoryManagementModule } from './inventory-management/inventory-management.module';
import { ProductSearchModule } from './product-search/product-search.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [ProductRow],
    }),
    TerminusModule,
    InventoryManagementModule,
    ProductSearchModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
