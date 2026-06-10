import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSchema } from '../infrastructure/database/order.schema';
import { CreateOrderDto } from '../presentation/dtos/order.dto';

import { SetOrderReadyUseCase } from './use-cases/set-order-ready.use-case';
import { ConfirmOrderUseCase } from './use-cases/confirm-order.use-case';
import { ApprovePaymentUseCase } from './use-cases/approve-payment.use-case';
import { ListAvailableOrdersUseCase } from './use-cases/list-available-orders.use-case';
import { ListCourierOrdersUseCase } from './use-cases/list-courier-orders.use-case';
import { AcceptOrderUseCase } from './use-cases/accept-order.use-case';
import { PickupOrderUseCase } from './use-cases/pickup-order.use-case';
import { DeliverOrderUseCase } from './use-cases/deliver-order.use-case';
import { GetCourierEarningsUseCase } from './use-cases/get-courier-earnings.use-case';

import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { ListUserOrdersUseCase } from './use-cases/list-user-orders.use-case';
import { ListRestaurantOrdersUseCase } from './use-cases/list-restaurant-orders.use-case';
import { GetOrderUseCase } from './use-cases/get-order.use-case';
import { CancelOrderUseCase } from './use-cases/cancel-order.use-case';

@Injectable()
export class OrderFacade {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly orderRepository: Repository<OrderSchema>,

    private readonly setOrderReadyUseCase: SetOrderReadyUseCase,
    private readonly confirmOrderUseCase: ConfirmOrderUseCase,
    private readonly approvePaymentUseCase: ApprovePaymentUseCase,
    private readonly listAvailableOrdersUseCase: ListAvailableOrdersUseCase,
    private readonly listCourierOrdersUseCase: ListCourierOrdersUseCase,
    private readonly acceptOrderUseCase: AcceptOrderUseCase,
    private readonly pickupOrderUseCase: PickupOrderUseCase,
    private readonly deliverOrderUseCase: DeliverOrderUseCase,
    private readonly getCourierEarningsUseCase: GetCourierEarningsUseCase,

    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listUserOrdersUseCase: ListUserOrdersUseCase,
    private readonly listRestaurantOrdersUseCase: ListRestaurantOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  async create(userId: number, dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(userId, dto);
  }

  async listByUser(userId: number) {
    return this.listUserOrdersUseCase.execute(userId);
  }

  async listByRestaurant(restaurantId: number, userId: number) {
    return this.listRestaurantOrdersUseCase.execute(restaurantId, userId);
  }

  async getOne(id: number, userId: number) {
    return this.getOrderUseCase.execute(id, userId);
  }

  async cancel(id: number, userId: number, role: string) {
    return this.cancelOrderUseCase.execute(id, userId, role);
  }

  async setReady(id: number, userId: number, role: string) {
    return this.setOrderReadyUseCase.execute(id, userId, role);
  }

  async confirm(id: number, userId: number, role: string) {
    return this.confirmOrderUseCase.execute(id, userId, role);
  }

  async pay(id: number, userId: number, role: string) {
    return this.approvePaymentUseCase.execute(id, userId, role);
  }

  async listAvailable(role: string) {
    return this.listAvailableOrdersUseCase.execute(role);
  }

  async listCourierOrders(userId: number, role: string) {
    return this.listCourierOrdersUseCase.execute(userId, role);
  }

  async getCourierEarnings(userId: number, role: string) {
    return this.getCourierEarningsUseCase.execute(userId, role);
  }

  async countCourierDeliveries(courierId: number): Promise<number> {
    return this.orderRepository.count({ where: { courierId, status: 'DELIVERED' } });
  }

  async accept(id: number, userId: number, role: string) {
    return this.acceptOrderUseCase.execute(id, userId, role);
  }

  async pickup(id: number, userId: number, role: string, code: string) {
    return this.pickupOrderUseCase.execute(id, userId, role, code);
  }

  async deliver(id: number, userId: number, role: string, code: string) {
    return this.deliverOrderUseCase.execute(id, userId, role, code);
  }
}
