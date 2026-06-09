import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';
import { DataSource } from 'typeorm';

@Injectable()
export class ApprovePaymentUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly dataSource: DataSource,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Permitindo que o cliente que fez o pedido simule o pagamento para fins acadêmicos
    if (role === 'CUSTOMER' && order.getUserId() !== userId) {
      throw new ForbiddenException('Access denied. This order is not yours.');
    }

    try {
      order.approvePayment();
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    await this.orderRepository.save(order);
    
    // Atualiza a tabela de payments (simulação)
    await this.dataSource.query(`UPDATE "payments" SET status = 'APPROVED' WHERE "orderId" = $1`, [id]);
  }
}
