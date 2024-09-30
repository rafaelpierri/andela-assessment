import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The page number of the products list. Starts from 1.',
    example: 1,
    minimum: 1,
  })
  page: number;

  @IsOptional()
  @IsInt({ message: 'PageSize must be an integer' })
  @Min(1, { message: 'PageSize must be at least 1' })
  @Max(1000, { message: 'PageSize must be less than 1000' })
  @Type(() => Number)
  @ApiPropertyOptional({
    description: 'The number of products per page (at most 1000).',
    example: 10,
    minimum: 1,
  })
  pageSize: number;
}