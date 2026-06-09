import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';

@Injectable()
export class ConfirmOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem confirmar um pedido');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const restaurant = await this.restaurantRepository.findById(order.getRestaurantId());
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    try {
      order.confirm();
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    await this.orderRepository.save(order);
  }
}
