import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../src/validation-pipe/validation.pipe';

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
    description: 'Returns an error response if any required fields are missing or if the provided data fails validation.',
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
  findAll() {
    return this.productService.findAll();
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
