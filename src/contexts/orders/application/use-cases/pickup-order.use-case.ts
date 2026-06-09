import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';

@Injectable()
export class PickupOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string, code: string): Promise<void> {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Only couriers can pickup orders');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.getCourierId() !== userId) {
      throw new ForbiddenException('This order was accepted by another courier');
    }

    try {
      order.pickup(code);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
    await this.orderRepository.save(order);
  }
}
