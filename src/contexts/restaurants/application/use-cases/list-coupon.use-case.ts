import { Injectable } from '@nestjs/common';
import { CouponRepository } from '../../infrastructure/database/coupon.repository';
import { Coupon } from '../../domain/entities/coupon.entity';

@Injectable()
export class ListCouponUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(restaurantId: number): Promise<Coupon[]> {
    return this.couponRepository.findByRestaurant(restaurantId);
  }
}
