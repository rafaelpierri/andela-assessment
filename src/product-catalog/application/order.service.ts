import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { OrderDto } from '../presentation/dto/order.dto';
import { Product } from '../infrastructure/product.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  productRepository: Repository<Product>;

  constructor(readonly dataSource: DataSource) {
    this.productRepository = this.dataSource.getRepository(Product);
  }

  async process(orderDto: OrderDto): Promise<void> {
    if (orderDto.items.length == 0) throw new BadRequestException('An order must have at least one order item.');
    const productIds = orderDto.items.map(item => item.productId);
    if (productIds.length != new Set(productIds).size) throw new BadRequestException('Order items must be unique.');

    const products = await this.productRepository.findBy({ id: In(productIds) });
    const productMap = products.reduce((acc, product) => acc.set(product.id, product), new Map<number, Product>());
    const failedProducts = [];

    orderDto.items.forEach(item => {
      const product = productMap.get(item.productId);
      if (product.stock < item.quantity) {
        failedProducts.push(product);
      } else {
        product.stock = product.stock - item.quantity;
      }
    });
    
    if (failedProducts.length > 0) throw new ConflictException({
      message: 'Some order items exeed the products stock value.',
      products: failedProducts, order: orderDto});

    await this.dataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);

      for (let product of products) {
        const result = await productRepository
        .update({ id: product.id, updatedAt: product.updatedAt }, product);

        if (result.affected == 0) {
          throw new ConflictException(`Could not process the request for the Product with id #${product.id}. Please, try again.`);
        }
      }
    });
  }
}
