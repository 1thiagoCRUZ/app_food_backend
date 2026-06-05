import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliverySchema } from '../infrastructure/database/delivery.schema';

@Injectable()
export class DeliveryFacade {
  constructor(
    @InjectRepository(DeliverySchema)
    private readonly deliveryRepository: Repository<DeliverySchema>,
  ) {}

  async listAvailable() {
    return this.deliveryRepository.find({
      where: { status: 'FINDING_COURIER' },
      order: { createdAt: 'DESC' },
    });
  }
}
