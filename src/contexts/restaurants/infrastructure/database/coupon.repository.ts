import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponSchema } from './coupon.schema';
import { Coupon } from '../../domain/entities/coupon.entity';

@Injectable()
export class CouponRepository {
  constructor(
    @InjectRepository(CouponSchema)
    private readonly repository: Repository<CouponSchema>,
  ) {}

  async save(coupon: Coupon): Promise<Coupon> {
    const schema = this.repository.create({
      restaurantId: coupon.getRestaurantId(),
      code: coupon.getCode(),
      type: coupon.getType(),
      value: coupon.getValue(),
      min: coupon.getMin(),
      uses: coupon.getUses(),
      limit: coupon.getLimit(),
      isActive: coupon.getIsActive(),
      expiresAt: coupon.getExpiresAt(),
    });
    
    const saved = await this.repository.save(schema);
    
    return Coupon.create({
      id: saved.id,
      restaurantId: saved.restaurantId,
      code: saved.code,
      type: saved.type as any,
      value: saved.value,
      min: saved.min,
      uses: saved.uses,
      limit: saved.limit,
      isActive: saved.isActive,
      expiresAt: saved.expiresAt,
      createdAt: saved.createdAt,
    });
  }

  async findByRestaurant(restaurantId: number): Promise<Coupon[]> {
    const schemas = await this.repository.find({ where: { restaurantId } });
    
    return schemas.map(schema => Coupon.create({
      id: schema.id,
      restaurantId: schema.restaurantId,
      code: schema.code,
      type: schema.type as any,
      value: schema.value,
      min: schema.min,
      uses: schema.uses,
      limit: schema.limit,
      isActive: schema.isActive,
      expiresAt: schema.expiresAt,
      createdAt: schema.createdAt,
    }));
  }
}
