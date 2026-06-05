import { Injectable, Inject, Logger } from '@nestjs/common';
import { PAYMENT_REPOSITORY_PORT } from '../ports/payment-repository.port';
import type { PaymentRepositoryPort } from '../ports/payment-repository.port';
import { PAYMENT_GATEWAY_PORT } from '../ports/payment-gateway.port';
import type { PaymentGatewayPort } from '../ports/payment-gateway.port';
import { ORDER_REPOSITORY_PORT } from '../../../orders/application/ports/order-repository.port';
import type { OrderRepositoryPort } from '../../../orders/application/ports/order-repository.port';
import { TrackingGateway } from '../../../communications/presentation/gateways/tracking.gateway';
export interface ProcessWebhookInput {
  action: string;
  data: {
    id: string; 
  };
}
@Injectable()
export class ProcessWebhookUseCase {
  private readonly logger = new Logger(ProcessWebhookUseCase.name);
  constructor(
    @Inject(PAYMENT_REPOSITORY_PORT)
    private readonly paymentRepository: PaymentRepositoryPort,
    @Inject(PAYMENT_GATEWAY_PORT)
    private readonly paymentGateway: PaymentGatewayPort,
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly trackingGateway: TrackingGateway,
  ) {}
  async execute(input: ProcessWebhookInput): Promise<{ processed: boolean; status?: string }> {
    if (input.action !== 'payment.updated' && input.action !== 'payment.created' && !input.action.startsWith('test')) {
      this.logger.log(`Ação de webhook não processada: ${input.action}`);
      return { processed: false };
    }
    const transactionId = input.data.id;
    this.logger.log(`Processando Webhook para a transação Mercado Pago: ${transactionId}`);
    const realStatus = await this.paymentGateway.verifyPayment(transactionId);
    this.logger.log(`Status real retornado pelo Gateway para ${transactionId}: ${realStatus}`);
    const payment = await this.paymentRepository.findByTransactionId(transactionId);
    if (!payment) {
      this.logger.warn(`Pagamento local correspondente à transação ${transactionId} não foi encontrado no banco local.`);
      return { processed: false };
    }
    if (payment.getStatus() === 'APPROVED') {
      this.logger.log(`Pagamento ${transactionId} já estava com status APPROVED. Nenhuma ação necessária.`);
      return { processed: true, status: 'APPROVED' };
    }
    if (realStatus === 'APPROVED') {
      payment.approve();
    } else if (realStatus === 'REJECTED') {
      payment.reject();
    }
    await this.paymentRepository.save(payment);
    if (realStatus === 'APPROVED') {
      const orderId = payment.getOrderId();
      const order = await this.orderRepository.findById(orderId);
      if (order) {
        order.approvePayment(); 
        await this.orderRepository.save(order);
        this.logger.log(`[Sucesso] Pedido #${orderId} atualizado para PREPARING após confirmação de pagamento.`);
        try {
          const roomName = `order_${orderId}`;
          this.trackingGateway.server.to(roomName).emit('paymentApproved', {
            orderId,
            status: 'PREPARING',
            message: 'Pagamento confirmado com sucesso! O restaurante já foi notificado e começou a preparar seu pedido.',
            timestamp: new Date()
          });
          this.logger.log(`Evento de WebSocket 'paymentApproved' emitido com sucesso na sala '${roomName}'`);
        } catch (wsError) {
          this.logger.error(`Falha ao emitir mensagem via WebSocket para o pedido ${orderId}`, wsError);
        }
      } else {
        this.logger.error(`Pedido ID ${orderId} associado ao pagamento não foi encontrado!`);
      }
    }
    return { processed: true, status: realStatus };
  }
}
