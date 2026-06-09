import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourierSchema } from './infrastructure/database/courier.schema';
import { CourierFacade } from './application/courier.facade';
import { CourierController } from './presentation/controllers/courier.controller';
import { CourierRepository } from './infrastructure/database/courier.repository';
import { ToggleOnlineStatusUseCase } from './application/use-cases/toggle-online-status.use-case';
import { UpdateCourierProfileUseCase } from './application/use-cases/update-courier-profile.use-case';
import { GetCourierProfileUseCase } from './application/use-cases/get-courier-profile.use-case';
import { CreateCourierProfileUseCase } from './application/use-cases/create-courier-profile.use-case';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourierSchema]),
    forwardRef(() => OrdersModule)
  ],
  controllers: [CourierController],
  providers: [
    CourierFacade,
    CourierRepository,
    ToggleOnlineStatusUseCase,
    UpdateCourierProfileUseCase,
    GetCourierProfileUseCase,
    CreateCourierProfileUseCase
  ],
  exports: [CourierFacade]
})
export class DeliveryModule {}
