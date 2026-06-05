import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantSchema } from './infrastructure/database/restaurant.schema';
import { AdressSchema } from './infrastructure/database/address.schema';
import { SharedModule } from '../../shared/shared.module';
import { GeocodeRestaurantAddressUseCase } from './application/use-cases/geocode-restaurant-address.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantSchema, AdressSchema]),
    SharedModule
  ],
  controllers: [],
  providers: [GeocodeRestaurantAddressUseCase],
  exports: [GeocodeRestaurantAddressUseCase]
})
export class RestaurantModule {}

