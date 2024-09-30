import { ApiProperty } from '@nestjs/swagger';

export class ProductData {
  constructor(partial: Partial<ProductData>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'The unique identifier for the product.',
    example: 1,
    required: false,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the product.',
    example: 'Razer BlackWidow V4 X Mechanical Gaming Keyboard',
    required: false,
  })
  name: string;

  @ApiProperty({
    description: 'The description of the product.',
    example:
      'YELLOW MECHANICAL LINEAR SWITCHES: With zero distance between actuation and reset points at 1.2mm and only 45g of force required — enjoy instant, rapid-fire inputs that are just as quiet thanks to built-in sound dampeners',
    required: false,
  })
  description: string;

  @ApiProperty({
    description: 'The category that the prodcut belongs to.',
    example: 'Computers > Peripherals > Keyboards',
    required: false,
  })
  category: string;

  @ApiProperty({
    description: 'The price of the product.',
    example: '150.50',
    required: false,
  })
  price: number;

  @ApiProperty({
    description: 'Amount of available units of this product.',
    example: '10',
    required: false,
  })
  stock: number;

  @ApiProperty({
    description: 'The time the product was created.',
    example: '2024-09-28T00:52:46.316Z',
    required: false,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last time the product was updated.',
    example: '2024-09-28T00:52:46.316Z',
    required: false,
  })
  updatedAt: Date;
}

export class ProductDto {
  @ApiProperty({
    description: 'The product details',
    type: ProductData,
    required: false,
  })
  data: ProductData;

  constructor(product: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.data = new ProductData(product);
  }
}
