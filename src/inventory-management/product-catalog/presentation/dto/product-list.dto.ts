import { ApiProperty } from '@nestjs/swagger';
import { ProductData } from './product.dto';
import { PaginationDto } from '../../../../commons/presentation/dto/pagination.dto';

export class ProductListDto {
  @ApiProperty({
    description: 'The page of the product list.',
    type: [ProductData],
    required: false,
  })
  data: ProductData[];
  @ApiProperty({
    description: 'Metadata about pagination.',
    type: PaginationDto,
    required: false,
  })
  meta: PaginationDto;

  constructor(
    products: Array<{
      id: number;
      name: string;
      description: string;
      category: string;
      price: number;
      stock: number;
      createdAt: Date;
      updatedAt: Date;
    }>,
    meta: Partial<PaginationDto>,
  ) {
    this.data = products.map((product) => new ProductData(product));
    this.meta = new PaginationDto(meta);
  }
}
