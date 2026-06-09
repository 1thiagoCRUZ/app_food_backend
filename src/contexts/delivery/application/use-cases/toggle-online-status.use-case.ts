import { Injectable, ForbiddenException, BadRequestException, Inject } from '@nestjs/common';
import { CourierRepository } from '../../infrastructure/database/courier.repository';
import { Courier } from '../../domain/entities/courier.entity';
import { ORDER_REPOSITORY_PORT, type OrderRepositoryPort } from '../../../orders/application/ports/order-repository.port';

@Injectable()
export class ToggleOnlineStatusUseCase {
  constructor(
    private readonly courierRepository: CourierRepository,
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(userId: number, role: string, isOnline: boolean): Promise<Courier> {
    if (role !== 'DELIVERY' && role !== 'COURIER') {
      throw new ForbiddenException('Only couriers can change online status');
    }

    if (!isOnline) {
      const activeOrders = await this.orderRepository.findCourierOrders(userId);
      const hasActiveOrders = activeOrders.some(o => o.getStatus() !== 'DELIVERED' && o.getStatus() !== 'CANCELLED');
      if (hasActiveOrders) {
        throw new BadRequestException('You cannot go offline while having active deliveries');
      }
    }

    let courier = await this.courierRepository.findByUserId(userId);
    
    if (!courier) {
      courier = Courier.create({ userId, isOnline });
    } else {
      courier.toggleOnlineStatus(isOnline);
    }

    return this.courierRepository.save(courier);
  }
}
