import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySchema } from './infrastructure/database/delivery.schema';
import { CourierSchema } from './infrastructure/database/courier.schema';
import { DeliveryFacade } from './application/delivery.facade';
import { CourierFacade } from './application/courier.facade';
import { DeliveryController } from './presentation/controllers/delivery.controller';
import { CourierController } from './presentation/controllers/courier.controller';
import { CourierRepository } from './infrastructure/database/courier.repository';
import { ToggleOnlineStatusUseCase } from './application/use-cases/toggle-online-status.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliverySchema, CourierSchema])
  ],
  controllers: [DeliveryController, CourierController],
  providers: [
    DeliveryFacade,
    CourierFacade,
    CourierRepository,
    ToggleOnlineStatusUseCase
  ],
  exports: [DeliveryFacade, CourierFacade]
})
export class DeliveryModule {}
