import { Controller, Get, UsePipes, BadRequestException, Query } from '@nestjs/common';
import { SearchService } from '../application/search.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductListDto } from './dto/product-list.dto';
import { ValidationPipe } from '../../commons/pipes/validation.pipe';
import { PaginationDto } from '../../commons/presentation/dto/pagination.dto';
import { SearchParamsDto } from './dto/search-params.dto';

@ApiTags('Product Search')
@Controller('products')
@UsePipes(new ValidationPipe())
export class SearchController {
  constructor(private readonly productService: SearchService) {}

  @Get('/search')
  @ApiOperation({ summary: 'Lists all products available.' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of all products available ordered by name in ascending order.',
    type: ProductListDto
  })
  @ApiResponse({
    status: 400,
    description: 'Fails if the pagination query parameters are incorrect.',
    type: BadRequestException,
    example: {
      "message": [
        {
          "target": {
            "page": null
          },
          "value": null,
          "property": "page",
          "children": [],
          "constraints": {
            "min": "Page must be at least 1",
            "isInt": "Page must be an integer"
          }
        }
      ],
      "error": "Bad Request",
      "statusCode": 400
    }
  })
  findAll(@Query() pagination: PaginationDto, @Query() searchParams: SearchParamsDto) {
    return this.productService.findAll(pagination.page, pagination.pageSize);
  }
}
