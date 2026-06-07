import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { CouponFacade } from '../../application/coupon.facade';
import { CreateCouponDto } from '../dtos/coupon.dto';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
@UseGuards(JwtAuthGuard)
export class CouponController {
  constructor(private readonly couponFacade: CouponFacade) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCouponDto) {
    const coupon = await this.couponFacade.create(dto);
    return {
      message: 'Coupon created successfully',
      id: coupon.getId(),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query('restaurantId') restaurantId: number) {
    const coupons = await this.couponFacade.listByRestaurant(restaurantId);
    return coupons.map(c => ({
      id: c.getId(),
      restaurantId: c.getRestaurantId(),
      code: c.getCode(),
      type: c.getType(),
      value: c.getValue(),
      min: c.getMin(),
      uses: c.getUses(),
      limit: c.getLimit(),
      isActive: c.getIsActive(),
      expiresAt: c.getExpiresAt(),
      createdAt: c.getCreatedAt(),
    }));
  }
}
