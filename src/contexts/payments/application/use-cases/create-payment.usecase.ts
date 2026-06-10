import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PAYMENT_REPOSITORY_PORT } from '../ports/payment-repository.port';
import type { PaymentRepositoryPort } from '../ports/payment-repository.port';
import { PAYMENT_GATEWAY_PORT } from '../ports/payment-gateway.port';
import type { PaymentGatewayPort, CreatePaymentResponse } from '../ports/payment-gateway.port';
import { ORDER_REPOSITORY_PORT } from '../../../orders/application/ports/order-repository.port';
import type { OrderRepositoryPort } from '../../../orders/application/ports/order-repository.port';
import { Payment } from '../../domain/entities/payment.entity';

export interface CreatePaymentInput {
  orderId: number;
  method: 'PIX' | 'CREDIT_CARD';
  customerEmail: string;
}
@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_PORT)
    private readonly paymentRepository: PaymentRepositoryPort,
    @Inject(PAYMENT_GATEWAY_PORT)
    private readonly paymentGateway: PaymentGatewayPort,
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}
  async execute(input: CreatePaymentInput): Promise<CreatePaymentResponse> {
    const order = await this.orderRepository.findById(input.orderId);
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${input.orderId} não encontrado!`);
    }
    const existingPayment = await this.paymentRepository.findByOrderId(input.orderId);
    if (existingPayment && existingPayment.getStatus() === 'APPROVED') {
      throw new Error(`Este pedido já possui um pagamento aprovado!`);
    }
    const gatewayResponse = await this.paymentGateway.createPayment(
      order.getId()!,
      order.getTotal(),
      input.method,
      input.customerEmail,
    );
    const payment = Payment.create({
      orderId: order.getId()!,
      transactionId: gatewayResponse.transactionId,
      amount: order.getTotal(),
      method: input.method,
      status: gatewayResponse.status,
    });
    await this.paymentRepository.save(payment);
    return gatewayResponse;
  }
}
