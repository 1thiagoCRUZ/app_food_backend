import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';

@Injectable()
export class SetOrderReadyUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem alterar o status do pedido');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const restaurant = await this.restaurantRepository.findById(order.getRestaurantId());
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    order.setReadyForPickup();
    await this.orderRepository.save(order);
  }
}
