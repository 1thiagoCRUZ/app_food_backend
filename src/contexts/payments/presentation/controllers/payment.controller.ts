import { Controller, Post, Body, HttpCode, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { PaymentFacade } from '../../application/payment.facade';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private readonly paymentFacade: PaymentFacade) {}
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Webhook bruto recebido do Mercado Pago: ${JSON.stringify(payload)}`);
    let transactionId = payload.data?.id || payload.id;
    if (!transactionId && payload.resource) {
      const parts = payload.resource.split('/');
      transactionId = parts[parts.length - 1];
    }
    if (!transactionId) {
      this.logger.warn('ID de transação não identificado no webhook recebido.');
      return { received: true, message: 'No transaction ID found' };
    }
    const action = payload.action || 'payment.updated';
    try {
      const result = await this.paymentFacade.processWebhook({
        action,
        data: { id: String(transactionId) }
      });
      return { received: true, ...result };
    } catch (error: any) {
      this.logger.error(`Erro ao processar webhook do Mercado Pago: ${error.message}`);
      return { received: true, error: error.message };
    }
  }
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(
    @Body() body: { orderId: number; method: 'PIX' | 'CREDIT_CARD'; customerEmail: string }
  ) {
    this.logger.log(`Solicitação de checkout para o Pedido #${body.orderId} via ${body.method}`);
    return this.paymentFacade.create({
      orderId: body.orderId,
      method: body.method || 'PIX',
      customerEmail: body.customerEmail || 'cliente@appfood.com.br'
    });
  }
}
