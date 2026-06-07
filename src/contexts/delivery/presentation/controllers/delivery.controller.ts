import { Controller, Get, UseGuards } from '@nestjs/common';
import { DeliveryFacade } from '../../application/delivery.facade';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Deliveries')
@ApiBearerAuth()
@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryFacade: DeliveryFacade) {}

  @Get('available')
  async listAvailable() {
    return this.deliveryFacade.listAvailable();
  }
}
