import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSchema } from '../infrastructure/database/order.schema';
import { OrderItemSchema } from '../infrastructure/database/order-item.schema';
import { CreateOrderDto } from '../presentation/dtos/order.dto';
@Injectable()
export class OrderFacade {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly orderRepository: Repository<OrderSchema>,
  ) {}
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
      items,
      deliveryVerificationCode: '1234', 
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
  async listByRestaurant(restaurantId: number) {
    return this.orderRepository.find({
      where: { restaurantId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
  async getOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }
}
