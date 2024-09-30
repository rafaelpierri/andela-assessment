import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductListDto } from '../presentation/dto/product-list.dto';

@Injectable()
export class SearchService {
  constructor(readonly dataSource: DataSource) {}

  async findAll(
    { page = 1, pageSize = 10 }: { page: number; pageSize: number },
    searchParams: {
      category: string;
      minPrice: number;
      maxPrice: number;
      name: string;
    },
  ) {
    const take = pageSize;
    const skip = take * (page - 1);

    const selectQuery = this.dataSource
      .createQueryBuilder()
      .select(['id', 'name', 'description', 'category', 'price', 'stock'])
      .from('products', 'p');
    const countQuery = this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('products', 'p');

    if (searchParams.category) {
      selectQuery.andWhere('p.category = :category', {
        category: searchParams.category,
      });
      countQuery.andWhere('p.category = :category', {
        category: searchParams.category,
      });
    }

    if (searchParams.minPrice) {
      selectQuery.andWhere('p.price >= :minPrice', {
        minPrice: searchParams.minPrice,
      });
      countQuery.andWhere('p.price >= :minPrice', {
        minPrice: searchParams.minPrice,
      });
    }

    if (searchParams.maxPrice) {
      selectQuery.andWhere('p.price <= :maxPrice', {
        maxPrice: searchParams.maxPrice,
      });
      countQuery.andWhere('p.price <= :maxPrice', {
        maxPrice: searchParams.maxPrice,
      });
    }

    if (searchParams.name) {
      selectQuery.andWhere('p.name LIKE :name', {
        name: `${searchParams.name}%`,
      });
      countQuery.andWhere('p.name LIKE :name', {
        name: `${searchParams.name}%`,
      });
    }

    const [products, total] = await Promise.all([
      selectQuery.orderBy('p.name', 'ASC').skip(skip).take(take).getRawMany(),
      countQuery.getRawOne(),
    ]);

    return new ProductListDto(
      products.map((product) => ({
        id: parseInt(product.id),
        name: product.name as string,
        description: product.description as string,
        category: product.category as string,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
      })),
      {
        total: parseInt(total.count),
        page,
        perPage: take,
        totalPages: Math.ceil(total.count / take),
      },
    );
  }
}
