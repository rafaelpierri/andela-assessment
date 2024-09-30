import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class SearchParamsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'The minimum price a product can have to be included in the search results.',
    example: 5,
  })
  minPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({
    description:
      'The maximum price a product can have to be included in the search results.',
    example: 10,
  })
  maxPrice: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    description:
      'The category the product must belong to in order to be included in the search results (exact match).',
    example: 'Computers > Peripherals > Keyboards',
  })
  category: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiPropertyOptional({
    description:
      'The product name must start with the specified value to be included in the search results (case sensitive).',
    example: 'Razer',
  })
  name: string;
}
