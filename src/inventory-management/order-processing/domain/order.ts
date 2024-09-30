import { Product } from "../../product-catalog/domain/product";

export class Order {
    constructor(partial: Partial<Order>) {
        Object.assign(this, partial);
        if (this.items.length == 0) {
            throw new Error('An order must have at least one order item.');
        }
            
        const productIds = this.items.map(item => item.productId);
        if (productIds.length != new Set(productIds).size) {
            throw new Error('Order items must be unique.');
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
            throw new Error(`Some order items (productIds: [${failedProducts.map(p => p.id)}]) exeed the products stock count.`);
        }
    }

    getProductIds() {
        return this.items.map(item => item.productId);
    }

    readonly items: Array<{ productId: number; quantity: number; }>
}