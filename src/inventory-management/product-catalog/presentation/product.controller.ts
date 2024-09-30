import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  BadRequestException,
  Query,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ProductService } from '../application/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { RestockProductDto } from './dto/restock-product.dto';
import { ProductDto } from './dto/product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../commons/presentation/dto/pagination-query.dto';
import { ProductListDto } from './dto/product-list.dto';
import { ValidationPipe } from '../../../commons/pipes/validation.pipe';

@ApiTags('Product Catalog')
@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new product.' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created product.',
    type: ProductDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fails if the request body is not valid.',
    type: BadRequestException,
    example: {
      message: [
        {
          target: {},
          property: 'name',
          children: [],
          constraints: {
            isString: 'name must be a string',
          },
        },
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return new ProductDto(await this.productService.create(createProductDto));
  }

  @Get()
  @ApiOperation({ summary: 'Lists all products available.' })
  @ApiResponse({
    status: 200,
    description:
      'Returns a paginated list of all products available ordered by name in ascending order.',
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
  findAll(@Query() paginationDto: PaginationQueryDto): Promise<ProductListDto> {
    return this.productService.findAll(
      paginationDto.page,
      paginationDto.pageSize,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Restocks a product.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the product after the update.',
    type: ProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Fails if the product was not found.',
    type: NotFoundException,
    example: {
      message: 'Could not find Prodcut with id #1.',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Fails if the request body is not valid.',
    type: BadRequestException,
    example: {
      message: [
        {
          target: {
            stock: -1,
            updatedAt: '2024-09-28T00:52:46.316Z',
          },
          value: -1,
          property: 'stock',
          children: [],
          constraints: {
            min: 'stock must not be less than 0',
          },
        },
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Fails if a race condition is detected.',
    type: ConflictException,
    example: {
      message: `Could not process the request for the Product with id #1. Please, try again.`,
      error: 'Conflict',
      statusCode: 409,
    },
  })
  async restock(
    @Param('id') id: number,
    @Body() updateProductDto: RestockProductDto,
  ): Promise<ProductDto> {
    let product;
    try {
      product = await this.productService.restock({ id, ...updateProductDto });
    } catch (error) {
      if (error.message.startsWith('Could not find Prodcut with id')) {
        throw new NotFoundException(error.message);
      } else if (
        error.message.startsWith(
          'Could not process the request for the Product with id #',
        )
      ) {
        throw new ConflictException(error.message);
      } else {
        throw error;
      }
    }

    return new ProductDto(product);
  }
}
