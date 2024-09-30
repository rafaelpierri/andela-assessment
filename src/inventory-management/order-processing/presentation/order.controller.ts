import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
  HttpCode,
  ConflictException,
} from '@nestjs/common';
import { OrderDto } from './order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../commons/pipes/validation.pipe';
import { OrderService } from '../application/order.service';

@ApiTags('Order Processing')
@Controller('orders')
@UsePipes(new ValidationPipe())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary:
      'Receives an order for processing. If accepted, product stocks are decreased.',
  })
  @ApiResponse({
    status: 200,
    description: 'Informs the sucessful processing of the order.',
    example: { message: 'Order processed sucessfully.' },
  })
  @ApiResponse({
    status: 400,
    description: 'Fails if the request body is not valid.',
    type: BadRequestException,
    example: {
      message: 'An order must have at least one order item.',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'Fails if a race condition is detected or if the order quantity exceeds the product stock count.',
    type: ConflictException,
    example: {
      message: `Could not process the request for the Product with id #1. Please, try again.`,
      error: 'Conflict',
      statusCode: 409,
    },
  })
  @HttpCode(200)
  async create(@Body() orderDto: OrderDto): Promise<{ message: string }> {
    try {
      await this.orderService.process(orderDto);
      return { message: 'Order processed sucessfully.' };
    } catch (error) {
      if (
        error.message == 'An order must have at least one order item.' ||
        error.message == 'Order items must be unique.'
      ) {
        throw new BadRequestException(error.message);
      } else if (error.message.startsWith('Some order items (productIds:')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
