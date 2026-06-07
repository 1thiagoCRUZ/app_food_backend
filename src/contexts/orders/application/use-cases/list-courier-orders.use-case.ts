import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class ListCourierOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(userId: number, role: string) {
    if (role !== 'DELIVERY') {
      throw new ForbiddenException('Apenas entregadores podem ver seus próprios pedidos');
    }

    return this.orderRepository.findCourierOrders(userId);
  }
}
