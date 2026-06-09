import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class ListAvailableOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(role: string) {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Only couriers can see available orders');
    }

    return this.orderRepository.findAvailableOrders();
  }
}
