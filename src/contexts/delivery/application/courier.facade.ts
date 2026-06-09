import { Injectable } from '@nestjs/common';
import { ToggleOnlineStatusUseCase } from './use-cases/toggle-online-status.use-case';
import { UpdateCourierProfileUseCase } from './use-cases/update-courier-profile.use-case';
import { GetCourierProfileUseCase } from './use-cases/get-courier-profile.use-case';
import { CourierRepository } from '../infrastructure/database/courier.repository';
import { UpdateCourierProfileDto } from '../presentation/dtos/update-courier-profile.dto';

@Injectable()
export class CourierFacade {
  constructor(
    private readonly toggleOnlineStatusUseCase: ToggleOnlineStatusUseCase,
    private readonly updateCourierProfileUseCase: UpdateCourierProfileUseCase,
    private readonly getCourierProfileUseCase: GetCourierProfileUseCase,
    private readonly courierRepository: CourierRepository
  ) {}

  toggleOnlineStatus(userId: number, isOnline: boolean) {
    return this.toggleOnlineStatusUseCase.execute(userId, isOnline);
  }

  async listAll() {
    return this.courierRepository.findAll();
  }

  async updateProfile(userId: number, dto: UpdateCourierProfileDto) {
    return this.updateCourierProfileUseCase.execute(userId, dto);
  }

  async getProfile(userId: number) {
    return this.getCourierProfileUseCase.execute(userId);
  }
}
