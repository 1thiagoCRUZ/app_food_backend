import { Injectable } from '@nestjs/common';
import { CreatePaymentUseCase, CreatePaymentInput } from './use-cases/create-payment.usecase';
import { ProcessWebhookUseCase, ProcessWebhookInput } from './use-cases/process-webhook.usecase';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly processWebhookUseCase: ProcessWebhookUseCase,
  ) {}

  async create(input: CreatePaymentInput) {
    return this.createPaymentUseCase.execute(input);
  }

  async processWebhook(input: ProcessWebhookInput) {
    return this.processWebhookUseCase.execute(input);
  }
}
