import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).exec();
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = new this.orderModel(orderData);
    return order.save();
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, orderData, { new: true })
      .exec();
  }

  async findByCustomerEmail(email: string): Promise<Order[]> {
    return this.orderModel
      .find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .exec();
  }
}
