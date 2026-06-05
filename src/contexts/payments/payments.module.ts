import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSchema } from './infrastructure/database/payment.schema';
import { PaymentController } from './presentation/controllers/payment.controller';
import { CommunicationsModule } from '../communications/communications.module';
import { OrdersModule } from '../orders/orders.module';

import { PAYMENT_REPOSITORY_PORT } from './application/ports/payment-repository.port';
import { PaymentRepository } from './infrastructure/database/payment.repository';

import { PAYMENT_GATEWAY_PORT } from './application/ports/payment-gateway.port';
import { MercadoPagoAdapter } from './infrastructure/adapters/mercado-pago.adapter';

import { CreatePaymentUseCase } from './application/use-cases/create-payment.usecase';
import { ProcessWebhookUseCase } from './application/use-cases/process-webhook.usecase';
import { PaymentFacade } from './application/payment.facade';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentSchema]),
    CommunicationsModule,
    OrdersModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentFacade,
    CreatePaymentUseCase,
    ProcessWebhookUseCase,
    {
      provide: PAYMENT_REPOSITORY_PORT,
      useClass: PaymentRepository
    },
    {
      provide: PAYMENT_GATEWAY_PORT,
      useClass: MercadoPagoAdapter
    }
  ],
  exports: [
    PaymentFacade
  ]
})
export class PaymentsModule {}
