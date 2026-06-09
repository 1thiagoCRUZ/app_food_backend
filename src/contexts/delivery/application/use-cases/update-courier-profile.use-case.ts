import { Injectable } from '@nestjs/common';
import { CourierRepository } from '../../infrastructure/database/courier.repository';
import { Courier } from '../../domain/entities/courier.entity';
import { UpdateCourierProfileDto } from '../../presentation/dtos/update-courier-profile.dto';

@Injectable()
export class UpdateCourierProfileUseCase {
  constructor(private readonly courierRepository: CourierRepository) {}

  async execute(userId: number, dto: UpdateCourierProfileDto): Promise<Courier> {
    let courier = await this.courierRepository.findByUserId(userId);
    
    if (!courier) {
      courier = Courier.create({ 
        userId, 
        isOnline: false,
        cnh: dto.cnh,
        vehiclePlate: dto.vehiclePlate
      });
    } else {
      courier.updateProfile(
        dto.cnh || courier.getCnh() || '', 
        dto.vehiclePlate || courier.getVehiclePlate() || ''
      );
    }

    return this.courierRepository.save(courier);
  }
}
