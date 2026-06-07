import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantSchema } from './infrastructure/database/restaurant.schema';
import { AdressSchema } from './infrastructure/database/address.schema';
import { CouponSchema } from './infrastructure/database/coupon.schema';
import { SharedModule } from '../../shared/shared.module';
import { GeocodeRestaurantAddressUseCase } from './application/use-cases/geocode-restaurant-address.usecase';
import { AddRestaurantAddressUseCase } from './application/use-cases/add-restaurant-address.use-case';
import { ListRestaurantAddressesUseCase } from './application/use-cases/list-restaurant-addresses.use-case';
import { RestaurantController } from './presentation/controllers/restaurant.controller';
import { CouponController } from './presentation/controllers/coupon.controller';
import { RestaurantFacade } from './application/restaurant.facade';
import { CouponFacade } from './application/coupon.facade';
import { RestaurantRepository } from './infrastructure/database/restaurant.repository';
import { RESTAURANT_REPOSITORY_PORT } from './application/ports/restaurant-repository.port';
import { CouponRepository } from './infrastructure/database/coupon.repository';
import { RegisterRestaurantUseCase } from './application/use-cases/register-restaurant.use-case';
import { UpdateRestaurantUseCase } from './application/use-cases/update-restaurant.use-case';
import { DeleteRestaurantUseCase } from './application/use-cases/delete-restaurant.use-case';
import { ListRestaurantUseCase } from './application/use-cases/list-restaurant.use-case';
import { ToggleRestaurantStatusUseCase } from './application/use-cases/toggle-restaurant-status.use-case';
import { CreateCouponUseCase } from './application/use-cases/create-coupon.use-case';
import { ListCouponUseCase } from './application/use-cases/list-coupon.use-case';
import { GetMyRestaurantUseCase } from './application/use-cases/get-my-restaurant.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantSchema, AdressSchema, CouponSchema]),
    SharedModule
  ],
  controllers: [RestaurantController, CouponController],
  providers: [
    GeocodeRestaurantAddressUseCase,
    RestaurantFacade,
    CouponFacade,
    {
      provide: RESTAURANT_REPOSITORY_PORT,
      useClass: RestaurantRepository
    },
    CouponRepository,
    RegisterRestaurantUseCase,
    UpdateRestaurantUseCase,
    DeleteRestaurantUseCase,
    ListRestaurantUseCase,
    ToggleRestaurantStatusUseCase,
    CreateCouponUseCase,
    ListCouponUseCase,
    GetMyRestaurantUseCase,
    AddRestaurantAddressUseCase,
    ListRestaurantAddressesUseCase
  ],
  exports: [GeocodeRestaurantAddressUseCase]
})
export class RestaurantModule {}
