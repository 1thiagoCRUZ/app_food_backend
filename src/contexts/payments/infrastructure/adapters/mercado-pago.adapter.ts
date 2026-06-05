import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGatewayPort, CreatePaymentResponse } from '../../application/ports/payment-gateway.port';
import { MercadoPagoConfig, Payment as MpPayment } from 'mercadopago';

@Injectable()
export class MercadoPagoAdapter implements PaymentGatewayPort {
  private readonly logger = new Logger(MercadoPagoAdapter.name);
  private paymentClient: MpPayment | null = null;
  private isSimulated = true;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    if (!token || token.trim() === '' || token.includes('seu_access_token')) {
      this.logger.warn(
        'MERCADOPAGO_ACCESS_TOKEN não configurada ou padrão no .env. Pagamentos rodarão em MODO SIMULADO (Mock)!'
      );
      this.isSimulated = true;
    } else {
      try {
        const config = new MercadoPagoConfig({ accessToken: token });
        this.paymentClient = new MpPayment(config);
        this.isSimulated = false;
        this.logger.log('Mercado Pago SDK inicializado com SUCESSO! Integração real ativada.');
      } catch (err: any) {
        this.logger.error('Falha ao instanciar SDK do Mercado Pago. Usando MODO SIMULADO!', err);
        this.isSimulated = true;
      }
    }
  }

  async createPayment(
    orderId: number,
    amount: number,
    method: 'PIX' | 'CREDIT_CARD',
    customerEmail: string,
  ): Promise<CreatePaymentResponse> {
    if (this.isSimulated || !this.paymentClient) {
      this.logger.log(`[Simulado] Criando cobrança PIX para o Pedido #${orderId} no valor de R$ ${amount}`);
      
      const transactionId = `sim_${Math.floor(100000000 + Math.random() * 900000000)}`;
      return {
        transactionId,
        status: 'PENDING',
        qrCode: `00020126580014br.gov.bcb.pix0136simulado-chave-pedido-${orderId}5204000053039865405${amount.toFixed(2)}5802BR5913App Food Corp6009Sao Paulo62070503***6304FC4A`,
        qrCodeBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        paymentUrl: `https://www.mercadopago.com.br/checkout/simulado/pay?id=${transactionId}`,
      };
    }

    try {
      this.logger.log(`[Mercado Pago] Solicitando transação real para Pedido #${orderId} de R$ ${amount}`);
      
      const response = await this.paymentClient.create({
        body: {
          transaction_amount: Number(amount),
          description: `Pedido #${orderId} - Food Delivery`,
          payment_method_id: method === 'PIX' ? 'pix' : 'credit_card',
          payer: {
            email: customerEmail || 'cliente@appfood.com.br',
          },
          metadata: {
            order_id: orderId
          }
        }
      });

      const transactionId = String(response.id);
      const mpStatus = response.status;
      
      let status: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';
      if (mpStatus === 'approved') status = 'APPROVED';
      else if (mpStatus === 'rejected' || mpStatus === 'cancelled') status = 'REJECTED';

      const transactionData = response.point_of_interaction?.transaction_data;

      return {
        transactionId,
        status,
        qrCode: transactionData?.qr_code || undefined,
        qrCodeBase64: transactionData?.qr_code_base64 || undefined,
        paymentUrl: (response as any).init_point || (response as any).sandbox_init_point || (response as any).point_of_interaction?.transaction_data?.ticket_url || undefined,
      };
    } catch (error: any) {
      this.logger.error(`Erro ao criar pagamento no Mercado Pago para o pedido ${orderId}:`, error);
      throw new Error(`Falha na integração com Mercado Pago: ${error.message}`);
    }
  }

  async verifyPayment(transactionId: string): Promise<'PENDING' | 'APPROVED' | 'REJECTED'> {
    if (this.isSimulated || !this.paymentClient || transactionId.startsWith('sim_')) {
      this.logger.log(`[Simulado] Verificando status da transação simulada: ${transactionId}`);
      return 'APPROVED';
    }

    try {
      this.logger.log(`[Mercado Pago] Consultando status real da transação: ${transactionId}`);
      const response = await this.paymentClient.get({ id: Number(transactionId) });
      const mpStatus = response.status;

      if (mpStatus === 'approved') {
        return 'APPROVED';
      } else if (mpStatus === 'rejected' || mpStatus === 'cancelled') {
        return 'REJECTED';
      }
      return 'PENDING';
    } catch (error: any) {
      this.logger.error(`Erro ao consultar pagamento ${transactionId} no Mercado Pago:`, error);
      return 'PENDING';
    }
  }
}
