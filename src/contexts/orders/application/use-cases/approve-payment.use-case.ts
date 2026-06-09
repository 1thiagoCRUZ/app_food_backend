import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException, forwardRef } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';
import { PaymentFacade } from '../../payments/application/payment.facade';
import { DataSource } from 'typeorm';

@Injectable()
export class ApprovePaymentUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(forwardRef(() => PaymentFacade))
    private readonly paymentFacade: PaymentFacade,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role === 'CUSTOMER' && order.getUserId() !== userId) {
      throw new ForbiddenException('Access denied. This order is not yours.');
    }

    try {
      order.approvePayment();
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    await this.orderRepository.save(order);
    
    // Atualiza a tabela de payments de forma correta via módulo de pagamentos
    if (order.getId()) {
      await this.paymentFacade.simulateApprovalByOrder(order.getId()!);
    }
  }
}
