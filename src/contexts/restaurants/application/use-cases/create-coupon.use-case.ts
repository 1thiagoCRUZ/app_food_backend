import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { CouponRepository } from '../../infrastructure/database/coupon.repository';
import { CreateCouponDto } from '../../presentation/dtos/coupon.dto';
import { Coupon } from '../../domain/entities/coupon.entity';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../ports/restaurant-repository.port';

@Injectable()
export class CreateCouponUseCase {
  constructor(
    private readonly couponRepository: CouponRepository,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(dto: CreateCouponDto, userId: number, role: string): Promise<Coupon> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem criar cupons');
    }

    const restaurant = await this.restaurantRepository.findById(dto.restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }
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
