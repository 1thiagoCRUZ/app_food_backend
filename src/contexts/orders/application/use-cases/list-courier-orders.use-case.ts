import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class ListCourierOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(userId: number, role: string) {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Only couriers can see their own orders');
    }

    return this.orderRepository.findCourierOrders(userId);
  }
}
