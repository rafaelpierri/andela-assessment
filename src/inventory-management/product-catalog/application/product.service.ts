import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../domain/product.repository';
import { Pagination, Product, ProductAttributes } from '../domain/product';

@Injectable()
export class ProductService {
  constructor(readonly productRepository: ProductRepository) {}

  async create(
    productAttrs: Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ProductAttributes> {
    return this.productRepository.create(new Product(productAttrs));
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: Array<ProductAttributes>; meta: Pagination }> {
    return this.productRepository.findAll(page, pageSize, order);
  }

  async restock({
    id,
    stock,
    updatedAt,
  }: Pick<
    ProductAttributes,
    'id' | 'stock' | 'updatedAt'
  >): Promise<ProductAttributes> {
    const product = await this.productRepository.findOne(id);

    product.stock = stock;
    product.updatedAt = updatedAt;

    await this.productRepository.update([product]);

    return this.productRepository.findOne(id);
  }
}
