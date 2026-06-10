import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSchema } from '../../infrastructure/database/order.schema';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly orderRepository: Repository<OrderSchema>,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');
    
    if (order.userId !== userId) {
      const restaurant = await this.restaurantRepository.findById(order.restaurantId);
      if (!restaurant || restaurant.getOwnerId() !== userId) {
        throw new ForbiddenException('Access denied to the order');
      }
    }
    return order;
  }
}
