import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';
import { DataSource } from 'typeorm';

@Injectable()
export class AcceptOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly dataSource: DataSource,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Only couriers can accept orders');
    }

    const courierInfo = await this.dataSource.query(`SELECT "isOnline" FROM couriers WHERE "userId" = $1`, [userId]);
    if (!courierInfo || courierInfo.length === 0 || !courierInfo[0].isOnline) {
      throw new ForbiddenException('You must be online to accept orders');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.getCourierId()) {
      throw new ForbiddenException('This order has already been accepted by another courier');
    }

    order.assignCourier(userId);
    await this.orderRepository.save(order);
  }
}
