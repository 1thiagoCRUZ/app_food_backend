import { Injectable, NotFoundException } from '@nestjs/common';
import { CourierRepository } from '../../infrastructure/database/courier.repository';
import { Courier } from '../../domain/entities/courier.entity';

@Injectable()
export class ToggleOnlineStatusUseCase {
  constructor(private readonly courierRepository: CourierRepository) {}

  async execute(userId: number, isOnline: boolean): Promise<Courier> {
    let courier = await this.courierRepository.findByUserId(userId);
    
    if (!courier) {
      // Create new courier profile if it doesn't exist
      courier = Courier.create({ userId, isOnline });
    } else {
      courier.toggleOnlineStatus(isOnline);
    }

    return this.courierRepository.save(courier);
  }
}
