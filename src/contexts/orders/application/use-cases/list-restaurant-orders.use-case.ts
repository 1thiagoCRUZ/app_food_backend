import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSchema } from '../../infrastructure/database/order.schema';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';

@Injectable()
export class ListRestaurantOrdersUseCase {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly orderRepository: Repository<OrderSchema>,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(restaurantId: number, userId: number) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Access denied to restaurant orders');
    }
    return this.orderRepository.find({
      where: { restaurantId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
}
