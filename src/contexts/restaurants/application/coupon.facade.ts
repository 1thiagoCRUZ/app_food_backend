import { Injectable } from '@nestjs/common';
import { CreateCouponUseCase } from './use-cases/create-coupon.use-case';
import { ListCouponUseCase } from './use-cases/list-coupon.use-case';
import { CreateCouponDto } from '../presentation/dtos/coupon.dto';

@Injectable()
export class CouponFacade {
  constructor(
    private readonly createCouponUseCase: CreateCouponUseCase,
    private readonly listCouponUseCase: ListCouponUseCase,
  ) {}

  create(dto: CreateCouponDto) {
    return this.createCouponUseCase.execute(dto);
  }

  listByRestaurant(restaurantId: number) {
    return this.listCouponUseCase.execute(restaurantId);
  }
}
