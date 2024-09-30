import { BadRequestException, ConflictException } from "@nestjs/common";
import { Product } from "./product";

export class Order {
    constructor(partial: Partial<Order>) {
        Object.assign(this, partial);
        if (this.items.length == 0) {
            throw new BadRequestException('An order must have at least one order item.');
        }
            
        const productIds = this.items.map(item => item.productId);
        if (productIds.length != new Set(productIds).size) {
            throw new BadRequestException('Order items must be unique.');
        }
    }

    process(products: Map<number, Product>) {
        const failedProducts = [];

        this.items.forEach(item => {
          const product = products.get(item.productId);
          try {
            product.decreaseStock(item.quantity);
          } catch {
            failedProducts.push(product);
          }
        });
        
        if (failedProducts.length > 0) {
            throw new ConflictException({
                message: 'Some order items exeed the products stock count.',
                products: failedProducts, order: this});
        }
    }

    getProductIds() {
        return this.items.map(item => item.productId);
    }

    readonly items: Array<{ productId: number; quantity: number; }>
}