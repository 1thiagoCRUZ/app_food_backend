import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdressSchema } from '../../infrastructure/database/address.schema';

@Injectable()
export class ListAddressesUseCase {
  constructor(
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
  ) {}

  async execute(userId: number) {
    return this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', id: 'DESC' },
    });
  }
}
