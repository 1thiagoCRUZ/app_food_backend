import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderFacade } from '../../application/order.facade';
import { CreateOrderDto } from '../dtos/order.dto';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '../../../users/infrastructure/auth/current-user.decorator';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
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

  @Get('available')
  async listAvailable(@CurrentUser('role') role: string) {
    return this.orderFacade.listAvailable(role);
  }

  @Get('courier/my')
  async listCourierOrders(@CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    return this.orderFacade.listCourierOrders(userId, role);
  }

  @Patch(':id/ready')
  @HttpCode(HttpStatus.OK)
  async setReady(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    await this.orderFacade.setReady(id, userId, role);
    return { message: 'Pedido marcado como pronto para retirada' };
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    await this.orderFacade.confirm(id, userId, role);
    return { message: 'Pedido confirmado pelo restaurante e em preparo' };
  }

  @Patch(':id/pay')
  @HttpCode(HttpStatus.OK)
  async pay(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    await this.orderFacade.pay(id, userId, role);
    return { message: 'Pagamento aprovado (Simulação)' };
  }

  @Patch(':id/accept')
  @HttpCode(HttpStatus.OK)
  async accept(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    await this.orderFacade.accept(id, userId, role);
    return { message: 'Corrida aceita com sucesso' };
  }

  @Patch(':id/pickup')
  @HttpCode(HttpStatus.OK)
  async pickup(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string, @Body('code') code: string) {
    await this.orderFacade.pickup(id, userId, role, code);
    return { message: 'Pedido retirado com sucesso' };
  }

  @Patch(':id/deliver')
  @HttpCode(HttpStatus.OK)
  async deliver(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string, @Body('code') code: string) {
    await this.orderFacade.deliver(id, userId, role, code);
    return { message: 'Pedido entregue com sucesso' };
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    return this.orderFacade.cancel(id, userId, role);
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @CurrentUser('userId') userId: number) {
    return this.orderFacade.getOne(id, userId);
  }

  @Get('restaurant/:id')
  async listByRestaurant(@Param('id') id: number, @CurrentUser('userId') userId: number) {
    return this.orderFacade.listByRestaurant(id, userId);
  }
}
