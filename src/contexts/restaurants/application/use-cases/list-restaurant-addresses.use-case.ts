import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdressSchema } from '../../infrastructure/database/address.schema';

@Injectable()
export class ListRestaurantAddressesUseCase {
  constructor(
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
  ) {}

  async execute(restaurantId: number) {
    return this.addressRepository.find({
      where: { restaurantId },
      order: { isDefault: 'DESC', id: 'DESC' },
    });
  }
}
