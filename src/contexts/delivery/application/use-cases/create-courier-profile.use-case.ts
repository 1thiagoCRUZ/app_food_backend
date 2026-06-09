import { Injectable, ConflictException } from '@nestjs/common';
import { CourierRepository } from '../../infrastructure/database/courier.repository';
import { Courier } from '../../domain/entities/courier.entity';

@Injectable()
export class CreateCourierProfileUseCase {
  constructor(private readonly courierRepository: CourierRepository) {}

  async execute(userId: number, cnh?: string, vehiclePlate?: string): Promise<Courier> {
    const existingProfile = await this.courierRepository.findByUserId(userId);
    if (existingProfile) {
      throw new ConflictException('O entregador já possui um perfil associado a este usuário.');
    }

    const courier = Courier.create({
      userId,
      isOnline: false,
      cnh,
      vehiclePlate,
    });

    return this.courierRepository.save(courier);
  }
}
