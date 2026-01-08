import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('products')
@Controller('api/v1/products')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve a list of all available products. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
    schema: {
      example: [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Product Name',
          description: 'Product description',
          price: 9999,
          stock: 100,
          available: true,
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
    return this.productsService.findAll();
  }
}
