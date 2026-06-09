import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class ApprovePaymentUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Permitindo que o cliente que fez o pedido simule o pagamento para fins acadêmicos
    if (role === 'CUSTOMER' && order.getUserId() !== userId) {
      throw new ForbiddenException('Acesso negado. Este pedido não é seu.');
    }

    try {
      order.approvePayment();
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    await this.orderRepository.save(order);
  }
}
