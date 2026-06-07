import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CouponRepository } from '../../infrastructure/database/coupon.repository';
import { UpdateCouponDto } from '../../presentation/dtos/coupon.dto';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../ports/restaurant-repository.port';

@Injectable()
export class UpdateCouponUseCase {
  constructor(
    private readonly couponRepository: CouponRepository,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateCouponDto, userId: number, role: string): Promise<void> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem editar cupons');
    }
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }

    const restaurant = await this.restaurantRepository.findById(coupon.getRestaurantId());
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    if (dto.code) coupon.updateCode(dto.code);
    if (dto.type) coupon.updateType(dto.type);
    if (dto.value) coupon.updateValue(dto.value);
    if (dto.min !== undefined) coupon.updateMin(dto.min);
    if (dto.limit !== undefined) coupon.updateLimit(dto.limit);
    if (dto.isActive !== undefined) coupon.updateIsActive(dto.isActive);
    if (dto.expiresAt) coupon.updateExpiresAt(new Date(dto.expiresAt));

    await this.couponRepository.save(coupon);
  }
}
