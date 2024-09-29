import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { AppDataSource } from '../data-source';
import { ProductCatalogModule } from './product-catalog/product-catalog.module';
import { ProductSearchModule } from './product-search/product-search.module';
import { Product } from './product-catalog/infrastructure/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [Product]
    }),
    TerminusModule,
    ProductCatalogModule,
    ProductSearchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}