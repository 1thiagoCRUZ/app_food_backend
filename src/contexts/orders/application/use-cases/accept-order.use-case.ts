import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../ports/order-repository.port';
import { CourierFacade } from '../../delivery/application/courier.facade';

@Injectable()
export class AcceptOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(forwardRef(() => CourierFacade))
    private readonly courierFacade: CourierFacade,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Only couriers can accept orders');
    }

    try {
      const courierProfile = await this.courierFacade.getProfile(userId);
      if (!courierProfile.isOnline) {
        throw new ForbiddenException('You must be online to accept orders');
      }
    } catch (error: any) {
      if (error instanceof NotFoundException) {
         throw new ForbiddenException('Courier profile not found');
      }
      throw error;
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
