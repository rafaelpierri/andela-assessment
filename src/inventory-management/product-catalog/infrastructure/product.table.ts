import { Injectable } from "@nestjs/common";
import { Product } from "../domain/product";
import { ProductRepository } from "../domain/product.repository";
import { DataSource, In, Repository } from "typeorm";
import { ProductRow } from "./product.row";

@Injectable()
export class ProductTable implements ProductRepository {
    repository: Repository<ProductRow>;

    constructor(readonly dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(ProductRow);
    }

    async create(product: Product): Promise<Product> {
        const row = this.repository.create(product);
        return new Product(await this.repository.save(row));
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.repository.findOne({ where: { id } });

        if (!product) throw new Error(`Could not find Prodcut with id #${id}.`);

        return new Product(product);
    }

    async findMany(ids: Array<number>): Promise<Array<Product>> {
        return this.repository.findBy({ id: In(ids) })
        .then(products => products.map(product => new Product(product)));
    }

    async findAll(page: number, pageSize: number, order: "ASC" | "DESC"): Promise<{ data: Array<Product>, meta: { total: number; page: number; perPage: number; totalPages: number } }> {
        const take = pageSize;
        const skip = take * (page - 1);
    
        const [results, total] = await this.repository.findAndCount(
          {
            order: { name: order },
            take: take,
            skip: skip
          }
        );
    
        return { data: results.map(result => new Product(result)), meta: {
            total,
            page,
            perPage: take,
            totalPages: Math.ceil(total / take)
        }};
    }

    async update(products: Array<Product>): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const productRepository = manager.getRepository(ProductRow);

            for (let product of products) {
              const result = await productRepository
              .update({ id: product.id, updatedAt: product.updatedAt }, new ProductRow(product));

              if (result.affected == 0) {
                throw new Error(`Could not process the request for the Product with id #${product.id}. Please, try again.`);
              }
            }
        });
    }
}