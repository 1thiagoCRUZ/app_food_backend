import { Injectable } from '@nestjs/common';
import { CreateCouponUseCase } from './use-cases/create-coupon.use-case';
import { ListCouponUseCase } from './use-cases/list-coupon.use-case';
import { UpdateCouponUseCase } from './use-cases/update-coupon.use-case';
import { DeleteCouponUseCase } from './use-cases/delete-coupon.use-case';
import { CreateCouponDto, UpdateCouponDto } from '../presentation/dtos/coupon.dto';

@Injectable()
export class CouponFacade {
  constructor(
    private readonly createCouponUseCase: CreateCouponUseCase,
    private readonly listCouponUseCase: ListCouponUseCase,
    private readonly updateCouponUseCase: UpdateCouponUseCase,
    private readonly deleteCouponUseCase: DeleteCouponUseCase,
  ) {}

  create(dto: CreateCouponDto, userId: number, role: string) {
    return this.createCouponUseCase.execute(dto, userId, role);
  }

  listByRestaurant(restaurantId: number) {
    return this.listCouponUseCase.execute(restaurantId);
  }

  update(id: number, dto: UpdateCouponDto, userId: number, role: string) {
    return this.updateCouponUseCase.execute(id, dto, userId, role);
  }

  delete(id: number, userId: number, role: string) {
    return this.deleteCouponUseCase.execute(id, userId, role);
  }
}
