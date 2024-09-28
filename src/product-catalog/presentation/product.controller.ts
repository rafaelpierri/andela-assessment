import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, BadRequestException, Query } from '@nestjs/common';
import { ProductService } from '../application/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { ProductListDto } from './dto/product-list.dto';
import { ValidationPipe } from '../../commons/pipes/validation.pipe';

@ApiTags('Product Catalog')
@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new product.' })
  @ApiResponse({
    status: 201,
    description: 'Returns a newly created product upon successful creation.',
    type: ProductDto
  })
  @ApiResponse({
    status: 400,
    description: 'Fails if any of the required fields are missing or if the provided data fails validation.',
    type: BadRequestException,
    example: {
      "message": [
        {
          "target": {},
          "property": "name",
          "children": [],
          "constraints": {
            "isString": "name must be a string"
          }
        }
      ],
      "error": "Bad Request",
      "statusCode": 400
    }
  })
  create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productService.create(createProductDto);
  }

  @Get()
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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto.page, paginationDto.pageSize);
  }

  @Get('/search')
  @ApiTags('Product Search')
  findSome() {
    return this.productService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
}
