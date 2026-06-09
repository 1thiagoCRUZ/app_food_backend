import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CourierRepository } from '../../infrastructure/database/courier.repository';
import { OrderFacade } from '../../../orders/application/order.facade';

@Injectable()
export class GetCourierProfileUseCase {
  constructor(
    private readonly courierRepository: CourierRepository,
    private readonly orderFacade: OrderFacade,
  ) {}

  async execute(userId: number) {
    const courier = await this.courierRepository.findByUserId(userId);
    
    if (!courier) {
      throw new NotFoundException('Perfil de entregador não encontrado');
    }

    const totalDeliveries = await this.orderFacade.countCourierDeliveries(userId);

    return {
      id: courier.getId(),
      userId: courier.getUserId(),
      isOnline: courier.getIsOnline(),
      cnh: courier.getCnh(),
      vehiclePlate: courier.getVehiclePlate(),
      currentLat: courier.getCurrentLat(),
      currentLng: courier.getCurrentLng(),
      totalDeliveries,
      createdAt: courier.getCreatedAt(),
      updatedAt: courier.getUpdatedAt(),
    };
  }
}
