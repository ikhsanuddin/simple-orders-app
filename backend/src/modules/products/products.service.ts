import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@/database/mongo/repositories/product.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll() {
    return this.productRepository.findAll();
  }

  async findById(id: string) {
    return this.productRepository.findById(id);
  }
}
