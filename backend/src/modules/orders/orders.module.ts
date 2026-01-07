import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from '@/database/mongo/schemas/order.schema';
import { Product, ProductSchema } from '@/database/mongo/schemas/product.schema';
import { OrderRepository } from '@/database/mongo/repositories/order.repository';
import { ProductRepository } from '@/database/mongo/repositories/product.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, ProductRepository],
})
export class OrdersModule {}
