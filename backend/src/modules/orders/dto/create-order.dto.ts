import {
  IsEmail,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID from the products collection',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product to order (minimum 1)',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Name of the customer placing the order',
    example: 'John Doe',
    type: String,
  })
  @IsString()
  customerName: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'customer@example.com',
    type: String,
  })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    description: 'List of items in the order',
    type: [CreateOrderItemDto],
    example: [
      {
        productId: '507f1f77bcf86cd799439011',
        quantity: 2,
      },
      {
        productId: '507f1f77bcf86cd799439012',
        quantity: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
