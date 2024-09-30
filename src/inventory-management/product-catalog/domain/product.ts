export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  constructor(partial: Partial<ProductAttributes>) {
    Object.assign(this, partial);
  }

  id: number;

  name: string;

  description: string;

  category: string;

  price: number;

  stock: number;

  createdAt: Date;

  updatedAt: Date;

  decreaseStock(quantity: number) {
    if (this.stock < quantity) {
      throw new Error(
        `Quantity (${quantity}) must be less than or equal to the current stock count (${this.stock}).`,
      );
    } else {
      this.stock = this.stock - quantity;
    }
  }
}
