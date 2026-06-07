import { Injectable } from '@nestjs/common';
import { CouponRepository } from '../../infrastructure/database/coupon.repository';
import { CreateCouponDto } from '../../presentation/dtos/coupon.dto';
import { Coupon } from '../../domain/entities/coupon.entity';

@Injectable()
export class CreateCouponUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(dto: CreateCouponDto): Promise<Coupon> {
    const coupon = Coupon.create({
      restaurantId: dto.restaurantId,
      code: dto.code,
      type: dto.type,
      value: dto.value,
      min: dto.min,
      uses: 0,
      limit: dto.limit,
      isActive: dto.isActive,
      expiresAt: new Date(dto.expiresAt),
    });

    return this.couponRepository.save(coupon);
  }
}
