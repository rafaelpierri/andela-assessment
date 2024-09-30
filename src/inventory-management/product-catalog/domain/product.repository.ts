import { Pagination, Product } from "./product";

export abstract class ProductRepository {
    abstract create(product: Product): Promise<Product>;
    abstract findOne(id: number): Promise<Product>;
    abstract findMany(ids: Array<number>): Promise<Array<Product>>;
    abstract findAll(page: number, pageSize: number, order: string): Promise<{ data: Array<Product>, meta: Pagination }>;
    abstract update(products: Array<Product>): Promise<void>;
}