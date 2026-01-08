import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('orders')
@Controller('api/v1/orders')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Create a new order with customer information and ordered items. Calculates total amount automatically based on product prices and quantities. Requires authentication.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439011',
        customerName: 'John Doe',
        customerEmail: 'customer@example.com',
        items: [
          {
            productId: '507f1f77bcf86cd799439012',
            productName: 'Product Name',
            quantity: 2,
            price: 9999,
          },
        ],
        totalAmount: 59.98,
        status: 'pending',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid order data or product not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing JWT token.',
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description:
      'Retrieve a list of all orders with customer information, items, and order status. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully.',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439011',
          customerName: 'John Doe',
          customerEmail: 'customer@example.com',
          items: [
            {
              productId: '507f1f77bcf86cd799439012',
              productName: 'Product Name',
              quantity: 2,
              price: 9999,
            },
          ],
          totalAmount: 19998,
          status: 'pending',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or missing JWT token.',
  })
  async findAll() {
    return this.ordersService.findAll();
  }
}
