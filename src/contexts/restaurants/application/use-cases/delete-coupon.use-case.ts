import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { CouponRepository } from '../../infrastructure/database/coupon.repository';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../ports/restaurant-repository.port';

@Injectable()
export class DeleteCouponUseCase {
  constructor(
    private readonly couponRepository: CouponRepository,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem deletar cupons');
    }
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado');
    }
    
    const restaurant = await this.restaurantRepository.findById(coupon.getRestaurantId());
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    await this.couponRepository.delete(id);
  }
}
