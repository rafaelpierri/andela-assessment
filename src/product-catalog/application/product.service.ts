import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../presentation/dto/create-product.dto';
import { UpdateProductDto } from '../presentation/dto/update-product.dto';
import { ProductDto } from '../presentation/dto/product.dto';
import { ProductListDto } from '../presentation/dto/product-list.dto';
import { ProductRepository } from '../domain/product.repository';
import { Product } from '../domain/product';

@Injectable()
export class ProductService {
  constructor(readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.create(new Product(createProductDto));
    return new ProductDto(product);
  }

  async findAll(page: number = 1, pageSize: number = 10, order: "ASC" | "DESC" = "ASC") {
    const result = await this.productRepository.findAll(page, pageSize, order);
    return new ProductListDto(result.data, result.meta);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.productRepository.findOne(id);

    product.stock = updateProductDto.stock;
    product.updatedAt = updateProductDto.updatedAt;

    await this.productRepository.update([product]);

    return new ProductDto(await this.productRepository.findOne(id));
  }
}
