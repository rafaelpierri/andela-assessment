import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  constructor(partial: Partial<PaginationDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'The amount of records available.',
    example: 10,
    required: false,
  })
  total: number;

  @ApiProperty({
    description: 'The current page.',
    example: 1,
    required: false,
  })
  page: number;

  @ApiProperty({
    description: 'The amount of records per page.',
    example: 1,
    required: false,
  })
  perPage: number;

  @ApiProperty({
    description: 'The amount of pages available.',
    example: 10,
    required: false,
  })
  totalPages: number;
}
