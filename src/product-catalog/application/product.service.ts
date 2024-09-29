import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../presentation/dto/create-product.dto';
import { UpdateProductDto } from '../presentation/dto/update-product.dto';
import { ProductDto } from '../presentation/dto/product.dto';
import { Product } from '../infrastructure/product.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductListDto } from '../presentation/dto/product-list.dto';

@Injectable()
export class ProductService {
  productRepository: Repository<Product>;

  constructor(readonly dataSource: DataSource) {
    this.productRepository = this.dataSource.getRepository(Product);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = this.productRepository.create(createProductDto);
    return new ProductDto(await this.productRepository.save(product));
  }

  async findAll(page: number = 1, pageSize: number = 10) {
    const take = pageSize;
    const skip = take * (page - 1);

    const [result, total] = await this.productRepository.findAndCount(
      {
        order: { name: "ASC" },
        take: take,
        skip: skip
      }
    );

    return new ProductListDto(result, {
      total,
      page,
      perPage: take,
      totalPages: Math.ceil(total / take)
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException(`Could not find Prodcut with id #${id}.`);

    product.stock = updateProductDto.stock;

    const result = await this.productRepository
      .update({ id, updatedAt: updateProductDto.updatedAt }, product);

    if (result.affected == 0) {
      throw new ConflictException(`Could not process the request for the Product with id #${id}. Please, try again.`);
    }

    return new ProductDto(product);
  }
}
