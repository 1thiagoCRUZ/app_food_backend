import { Injectable, Inject } from '@nestjs/common';
import { CreatePaymentUseCase, CreatePaymentInput } from './use-cases/create-payment.usecase';
import { ProcessWebhookUseCase, ProcessWebhookInput } from './use-cases/process-webhook.usecase';
import { PAYMENT_REPOSITORY_PORT, type PaymentRepositoryPort } from './ports/payment-repository.port';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly processWebhookUseCase: ProcessWebhookUseCase,
    @Inject(PAYMENT_REPOSITORY_PORT)
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  async create(input: CreatePaymentInput) {
    return this.createPaymentUseCase.execute(input);
  }

  async processWebhook(input: ProcessWebhookInput) {
    return this.processWebhookUseCase.execute(input);
  }

  async simulateApprovalByOrder(orderId: number) {
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (payment) {
      payment.approve();
      await this.paymentRepository.save(payment);
    }
  }
}
