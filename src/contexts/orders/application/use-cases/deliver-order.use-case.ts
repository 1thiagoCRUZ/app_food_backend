import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string, code: string): Promise<void> {
    if (role !== 'DELIVERY') {
      throw new ForbiddenException('Apenas entregadores podem entregar pedidos');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.getCourierId() !== userId) {
      throw new ForbiddenException('Este pedido foi aceito por outro entregador');
    }

    order.deliver(code);
    await this.orderRepository.save(order);
  }
}
