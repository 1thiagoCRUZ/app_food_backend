import { Payment } from '../../domain/entities/payment.entity';

export interface PaymentRepositoryPort {
  save(payment: Payment): Promise<Payment>;
  findById(id: number): Promise<Payment | null>;
  findByTransactionId(transactionId: string): Promise<Payment | null>;
  findByOrderId(orderId: number): Promise<Payment | null>;
}

export const PAYMENT_REPOSITORY_PORT = 'PAYMENT_REPOSITORY_PORT';
