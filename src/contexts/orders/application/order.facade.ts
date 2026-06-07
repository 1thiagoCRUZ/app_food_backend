import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSchema } from '../infrastructure/database/order.schema';
import { OrderItemSchema } from '../infrastructure/database/order-item.schema';
import { CreateOrderDto } from '../presentation/dtos/order.dto';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../restaurants/application/ports/restaurant-repository.port';

import { SetOrderReadyUseCase } from './use-cases/set-order-ready.use-case';
import { ListAvailableOrdersUseCase } from './use-cases/list-available-orders.use-case';
import { ListCourierOrdersUseCase } from './use-cases/list-courier-orders.use-case';
import { AcceptOrderUseCase } from './use-cases/accept-order.use-case';
import { PickupOrderUseCase } from './use-cases/pickup-order.use-case';
import { DeliverOrderUseCase } from './use-cases/deliver-order.use-case';

@Injectable()
export class OrderFacade {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly orderRepository: Repository<OrderSchema>,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,

    private readonly setOrderReadyUseCase: SetOrderReadyUseCase,
    private readonly listAvailableOrdersUseCase: ListAvailableOrdersUseCase,
    private readonly listCourierOrdersUseCase: ListCourierOrdersUseCase,
    private readonly acceptOrderUseCase: AcceptOrderUseCase,
    private readonly pickupOrderUseCase: PickupOrderUseCase,
    private readonly deliverOrderUseCase: DeliverOrderUseCase,
  ) {}

  async setReady(id: number, userId: number, role: string) {
    return this.setOrderReadyUseCase.execute(id, userId, role);
  }

  async listAvailable(role: string) {
    return this.listAvailableOrdersUseCase.execute(role);
  }

  async listCourierOrders(userId: number, role: string) {
    return this.listCourierOrdersUseCase.execute(userId, role);
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

  async create(userId: number, dto: CreateOrderDto) {
    let total = 0;
    const items = dto.items.map(item => {
      total += item.price * item.quantity;
      const orderItem = new OrderItemSchema();
      orderItem.productId = item.productId;
      orderItem.name = item.name;
      orderItem.price = item.price;
      orderItem.quantity = item.quantity;
      return orderItem;
    });
    const order = this.orderRepository.create({
      userId,
      restaurantId: dto.restaurantId,
      deliveryAddressId: dto.deliveryAddressId,
      total,
      courierFee: total * 0.20,
      items,
      deliveryVerificationCode: Math.floor(1000 + Math.random() * 9000).toString(),
      pickupVerificationCode: Math.floor(1000 + Math.random() * 9000).toString(),
    });
    return this.orderRepository.save(order);
  }
  async listByUser(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
  async listByRestaurant(restaurantId: number, userId: number) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado aos pedidos do restaurante');
    }
    return this.orderRepository.find({
      where: { restaurantId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
  async getOne(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (order.userId !== userId) {
      const restaurant = await this.restaurantRepository.findById(order.restaurantId);
      if (!restaurant || restaurant.getOwnerId() !== userId) {
        throw new ForbiddenException('Acesso negado ao pedido');
      }
    }
    return order;
  }
}
