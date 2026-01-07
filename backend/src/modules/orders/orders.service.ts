import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepository } from '@/database/mongo/repositories/order.repository';
import { ProductRepository } from '@/database/mongo/repositories/product.repository';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // Fetch product details and validate stock
    const itemsWithDetails = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        // Validate stock availability
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
          );
        }

        if (product.stock <= 0) {
          throw new BadRequestException(
            `Product "${product.name}" is out of stock`,
          );
        }

        return {
          product,
          productId: new Types.ObjectId(item.productId),
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );

    // Decrease stock for each item
    await Promise.all(
      itemsWithDetails.map(async (item) => {
        const newStock = item.product.stock - item.quantity;
        await this.productRepository.update(item.productId.toString(), {
          stock: newStock,
        });
      }),
    );

    // Calculate totalAmount from items
    const totalAmount = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const orderData = {
      ...createOrderDto,
      totalAmount,
      items: itemsWithDetails.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    return this.orderRepository.create(orderData);
  }

  async findAll() {
    return this.orderRepository.findAll();
  }

  async findById(id: string) {
    return this.orderRepository.findById(id);
  }

  async findByCustomerEmail(email: string) {
    return this.orderRepository.findByCustomerEmail(email);
  }
}
