import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductListDto } from '../presentation/dto/product-list.dto';

@Injectable()
export class SearchService {

  constructor(readonly dataSource: DataSource) {}

  async findAll(page: number = 1, pageSize: number = 10) {
    const take = pageSize;
    const skip = take * (page - 1);

    const [products, total] = await Promise.all([
      this.dataSource
      .createQueryBuilder()
      .select(['id', 'name', 'description', 'category', 'price', 'stock'])
      .from('products', 'p')
      .orderBy('p.name', 'ASC')
      .skip(skip)
      .take(take)
      .getRawMany(),
      this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('products', 'p')
      .getRawOne()]);

    return new ProductListDto(products.map(product => ({
      id: parseInt(product.id),
      name: product.name as string,
      description: product.description as string,
      category: product.category as string,
      price: parseFloat(product.price),
      stock: parseInt(product.stock)
    })), {
      total: parseInt(total.count),
      page,
      perPage: take,
      totalPages: Math.ceil(total.count / take)
    });
  }
}
