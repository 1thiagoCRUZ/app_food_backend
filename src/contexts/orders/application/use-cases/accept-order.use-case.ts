import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class AcceptOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Apenas entregadores podem aceitar corridas');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.getCourierId()) {
      throw new ForbiddenException('Este pedido já foi aceito por outro entregador');
    }

    order.assignCourier(userId);
    await this.orderRepository.save(order);
  }
}
