import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentSchema } from './payment.schema';
import { PaymentRepositoryPort } from '../../application/ports/payment-repository.port';
import { Payment } from '../../domain/entities/payment.entity';

@Injectable()
export class PaymentRepository implements PaymentRepositoryPort {
  constructor(
    @InjectRepository(PaymentSchema)
    private readonly repository: Repository<PaymentSchema>,
  ) {}

  private toDomain(schema: PaymentSchema): Payment {
    return Payment.create({
      id: schema.id,
      orderId: schema.orderId,
      transactionId: schema.transactionId,
      amount: Number(schema.amount),
      method: schema.method as any,
      status: schema.status as any,
    });
  }

  private toSchema(payment: Payment): PaymentSchema {
    const schema = new PaymentSchema();
    if (payment.getId()) {
      schema.id = payment.getId() as number;
    }
    schema.orderId = payment.getOrderId();
    schema.transactionId = payment.getTransactionId();
    schema.amount = payment.getAmount();
    schema.method = payment.getMethod();
    schema.status = payment.getStatus();
    return schema;
  }

  async save(payment: Payment): Promise<Payment> {
    const schema = this.toSchema(payment);
    const savedSchema = await this.repository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: number): Promise<Payment | null> {
    const schema = await this.repository.findOne({ where: { id } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByTransactionId(transactionId: string): Promise<Payment | null> {
    const schema = await this.repository.findOne({ where: { transactionId } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByOrderId(orderId: number): Promise<Payment | null> {
    const schema = await this.repository.findOne({ where: { orderId } });
    if (!schema) return null;
    return this.toDomain(schema);
  }
}
