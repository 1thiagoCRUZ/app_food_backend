import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSchema } from '../../infrastructure/database/order.schema';

@Injectable()
export class ListUserOrdersUseCase {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly orderRepository: Repository<OrderSchema>,
  ) {}

  async execute(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
}
