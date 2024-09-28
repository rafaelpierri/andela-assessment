import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { Product } from './product.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductService {

  constructor(readonly dataSource: DataSource) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const productRepository = this.dataSource.getRepository(Product);
    const product = productRepository.create(createProductDto);
    return new ProductDto(await productRepository.save(product));
  }

  findAll() {
    return `This action returns all product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }
}
