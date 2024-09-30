import {
  Controller,
  Get,
  UsePipes,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { SearchService } from '../application/search.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductListDto } from './dto/product-list.dto';
import { ValidationPipe } from '../../commons/pipes/validation.pipe';
import { PaginationQueryDto } from '../../commons/presentation/dto/pagination-query.dto';
import { SearchParamsDto } from './dto/search-params.dto';

@ApiTags('Product Search')
@Controller('products')
@UsePipes(new ValidationPipe())
export class SearchController {
  constructor(private readonly productService: SearchService) {}

  @Get('/search')
  @ApiOperation({
    summary: 'Searches products by name, category and price range.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns a paginated list of the searched products ordered by name in ascending order.',
    type: ProductListDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fails if the pagination query parameters are incorrect.',
    type: BadRequestException,
    example: {
      message: [
        {
          target: {
            page: null,
          },
          value: null,
          property: 'page',
          children: [],
          constraints: {
            min: 'Page must be at least 1',
            isInt: 'Page must be an integer',
          },
        },
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() searchParams: SearchParamsDto,
  ) {
    return this.productService.findAll(pagination, searchParams);
  }
}
