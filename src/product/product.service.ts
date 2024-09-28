import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { Product } from './product.entity';
import { DataSource } from 'typeorm';
import { ProductListDto } from './dto/product-list.dto';

@Injectable()
export class ProductService {

  constructor(readonly dataSource: DataSource) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const productRepository = this.dataSource.getRepository(Product);
    const product = productRepository.create(createProductDto);
    return new ProductDto(await productRepository.save(product));
  }

  async findAll(page?: number, pageSize?: number) {
    const productRepository = this.dataSource.getRepository(Product);
    const take = pageSize || 10;
    const skip = take * ((page - 1) || 0);

    const [result, total] = await productRepository.findAndCount(
      {
        order: { name: "ASC" },
        take: take,
        skip: skip
      }
    );

    return new ProductListDto(result, {
      total,
      page: 1,
      perPage: take,
      totalPages: Math.ceil(total / take)
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }
}
