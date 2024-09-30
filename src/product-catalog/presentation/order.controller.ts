import { Controller, Post, Body, UsePipes, BadRequestException, HttpCode } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../commons/pipes/validation.pipe';
import { OrderService } from '../application/order.service';

@ApiTags('Order Processing')
@Controller('orders')
@UsePipes(new ValidationPipe())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Receives an order for processing. If accepted, product stocks are decreased.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the created product.',
  })
  @ApiResponse({
    status: 400,
    description: 'Fails if the request body is not valid.',
    type: BadRequestException,
    example: {
    }
  })
  @HttpCode(200)
  async create(@Body() orderDto: OrderDto): Promise<{ message: String }> {
    await this.orderService.process(orderDto);
    return { message: 'Order processed sucessfully.' };
  }
}
