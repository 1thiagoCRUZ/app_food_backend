import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class GetCourierEarningsUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(userId: number, role: string) {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Apenas entregadores podem ver seus ganhos');
    }

    const orders = await this.orderRepository.findCourierOrders(userId);
    const deliveredOrders = orders.filter(o => o.getStatus() === 'DELIVERED');

    let totalEarnings = 0;
    const deliveries = deliveredOrders.map(order => {
      totalEarnings += Number(order.getCourierFee() || 0);
      return {
        orderId: order.getId(),
        restaurantId: order.getRestaurantId(),
        date: order.getCreatedAt?.() || new Date(),
        fee: Number(order.getCourierFee() || 0),
      };
    });

    return {
      totalEarnings,
      totalDeliveries: deliveries.length,
      deliveries,
    };
  }
}
