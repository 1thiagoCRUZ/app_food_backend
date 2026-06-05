export interface CreatePaymentResponse {
  transactionId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  qrCode?: string;         
  qrCodeBase64?: string;   
  paymentUrl?: string;     
}
export interface PaymentGatewayPort {
  createPayment(
    orderId: number,
    amount: number,
    method: 'PIX' | 'CREDIT_CARD',
    customerEmail: string
  ): Promise<CreatePaymentResponse>;
  verifyPayment(transactionId: string): Promise<'PENDING' | 'APPROVED' | 'REJECTED'>;
}
export const PAYMENT_GATEWAY_PORT = 'PAYMENT_GATEWAY_PORT';
