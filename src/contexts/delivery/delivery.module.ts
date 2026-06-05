import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySchema } from './infrastructure/database/delivery.schema';
import { DeliveryFacade } from './application/delivery.facade';
import { DeliveryController } from './presentation/controllers/delivery.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliverySchema])
  ],
  controllers: [DeliveryController],
  providers: [DeliveryFacade],
  exports: [DeliveryFacade]
})
export class DeliveryModule {}
