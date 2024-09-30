import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { AppDataSource } from '../data-source';
import { ProductCatalogModule } from './product-catalog/product-catalog.module';
import { ProductSearchModule } from './product-search/product-search.module';
import { ProductRow } from './product-catalog/infrastructure/product.row';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [ProductRow]
    }),
    TerminusModule,
    ProductCatalogModule,
    ProductSearchModule
  ],
  controllers: [AppController],
})
export class AppModule {}