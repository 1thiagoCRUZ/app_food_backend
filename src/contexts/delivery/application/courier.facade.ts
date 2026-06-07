import { Injectable } from '@nestjs/common';
import { ToggleOnlineStatusUseCase } from './use-cases/toggle-online-status.use-case';
import { CourierRepository } from '../infrastructure/database/courier.repository';

@Injectable()
export class CourierFacade {
  constructor(
    private readonly toggleOnlineStatusUseCase: ToggleOnlineStatusUseCase,
    private readonly courierRepository: CourierRepository
  ) {}

  toggleOnlineStatus(userId: number, isOnline: boolean) {
    return this.toggleOnlineStatusUseCase.execute(userId, isOnline);
  }

  async listAll() {
    return this.courierRepository.findAll();
  }
}
