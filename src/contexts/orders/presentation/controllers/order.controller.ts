import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { OrderFacade } from '../../application/order.facade';
import { CreateOrderDto } from '../dtos/order.dto';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../../users/infrastructure/auth/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser('userId') userId: number, @Body() dto: CreateOrderDto) {
    const order = await this.orderFacade.create(userId, dto);
    return { message: 'Pedido criado com sucesso', id: order.id };
  }

  @Get()
  async list(@CurrentUser('userId') userId: number) {
    return this.orderFacade.listByUser(userId);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.orderFacade.getOne(id);
  }
}
