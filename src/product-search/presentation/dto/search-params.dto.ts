import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class SearchParamsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The minimum price a product can have to be included in the search results.',
    example: 5,
  })
  minPrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The maximum price a product can have to be included in the search results.',
    example: 10,
  })
  maxPrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The category the product must belong to in order to be included in the search results (exact match).',
    example: 'Computers > Peripherals > Keyboards',
  })
  category: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The product name must start with the specified value to be included in the search results.',
    example: 'Razer',
  })
  name: string;
}