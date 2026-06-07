import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { CouponFacade } from '../../application/coupon.facade';
import { CreateCouponDto, UpdateCouponDto } from '../dtos/coupon.dto';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../../users/infrastructure/auth/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
@UseGuards(JwtAuthGuard)
export class CouponController {
  constructor(private readonly couponFacade: CouponFacade) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser('userId') userId: number, @CurrentUser('role') role: string, @Body() dto: CreateCouponDto) {
    const coupon = await this.couponFacade.create(dto, userId, role);
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string, @Body() dto: UpdateCouponDto) {
    await this.couponFacade.update(id, dto, userId, role);
    return { message: 'Coupon updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    await this.couponFacade.delete(id, userId, role);
  }
}
