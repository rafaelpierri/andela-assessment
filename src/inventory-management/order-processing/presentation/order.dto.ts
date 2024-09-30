import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

class OrderItemDto {
  @ApiProperty({
    description: 'The unique identifier for the product.',
    example: 1,
    required: true,
  })
  @IsInt()
  @Min(0)
  productId: number;

  @ApiProperty({
    description: 'The amount of products in the order item.',
    example: 1,
    required: true,
  })
  @IsInt()
  @Min(0)
  quantity: number;
}

export class OrderDto {
  @ApiProperty({
    description: 'The items present in the order.',
    type: [OrderItemDto],
    required: true,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
