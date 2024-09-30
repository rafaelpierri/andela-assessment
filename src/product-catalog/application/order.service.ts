import { Injectable } from '@nestjs/common';
import { OrderDto } from '../presentation/dto/order.dto';
import { ProductRepository } from '../domain/product.repository';
import { Product } from '../domain/product';
import { Order } from '../domain/order';

@Injectable()
export class OrderService {
  constructor(readonly productRepository: ProductRepository) {}

  async process(orderDto: OrderDto): Promise<void> {
    const order = new Order(orderDto);
    const products = await this.productRepository.findMany(order.getProductIds())
    .then(results => results
      .reduce((acc, product) => acc.set(product.id, product), new Map<number, Product>()));
    
    order.process(products);

    await this.productRepository.update(Array.from(products.values()));
  }
}
