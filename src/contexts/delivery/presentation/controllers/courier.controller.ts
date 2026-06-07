import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Request, UseGuards } from '@nestjs/common';
import { CourierFacade } from '../../application/courier.facade';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Couriers')
@ApiBearerAuth()
@Controller('couriers')
@UseGuards(JwtAuthGuard)
export class CourierController {
  constructor(private readonly courierFacade: CourierFacade) {}

  @Patch('me/status')
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Request() req, @Body('isOnline') isOnline: boolean) {
    // req.user is populated by JwtAuthGuard
    const userId = req.user.id;
    const courier = await this.courierFacade.toggleOnlineStatus(userId, isOnline);
    return {
      message: 'Status updated successfully',
      isOnline: courier.getIsOnline(),
    };
  }

  @Get()
  async listAll() {
    return this.courierFacade.listAll();
  }
}
