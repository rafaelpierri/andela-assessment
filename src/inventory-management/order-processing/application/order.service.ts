import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../product-catalog/domain/product.repository';
import { Product } from '../../product-catalog/domain/product';
import { Order, OrderAttributes } from '../domain/order';

@Injectable()
export class OrderService {
  constructor(readonly productRepository: ProductRepository) {}

  async process(orderAttrs: OrderAttributes): Promise<void> {
    const order = new Order(orderAttrs);
    const products = await this.productRepository.findMany(order.getProductIds())
    .then(results => results
      .reduce((acc, product) => acc.set(product.id, product), new Map<number, Product>()));
    
    order.process(products);

    await this.productRepository.update(Array.from(products.values()));
  }
}
