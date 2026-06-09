import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySchema } from './infrastructure/database/delivery.schema';
import { CourierSchema } from './infrastructure/database/courier.schema';
import { DeliveryFacade } from './application/delivery.facade';
import { CourierFacade } from './application/courier.facade';
import { CourierController } from './presentation/controllers/courier.controller';
import { CourierRepository } from './infrastructure/database/courier.repository';
import { ToggleOnlineStatusUseCase } from './application/use-cases/toggle-online-status.use-case';
import { UpdateCourierProfileUseCase } from './application/use-cases/update-courier-profile.use-case';
import { GetCourierProfileUseCase } from './application/use-cases/get-courier-profile.use-case';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliverySchema, CourierSchema]),
    forwardRef(() => OrdersModule)
  ],
  controllers: [CourierController],
  providers: [
    DeliveryFacade,
    CourierFacade,
    CourierRepository,
    ToggleOnlineStatusUseCase,
    UpdateCourierProfileUseCase,
    GetCourierProfileUseCase
  ],
  exports: [DeliveryFacade, CourierFacade]
})
export class DeliveryModule {}
