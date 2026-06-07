import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdressSchema } from '../../infrastructure/database/address.schema';
import { CreateAddressDto } from '../../presentation/dtos/address.dto';
import { GeocodeUserAddressUseCase } from './geocode-user-address.usecase';

@Injectable()
export class AddAddressUseCase {
  constructor(
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
    private readonly geocodeUserAddressUseCase: GeocodeUserAddressUseCase,
  ) {}

  async execute(userId: number, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }
    
    const address = this.addressRepository.create({
      ...dto,
      userId,
      isDefault: dto.isDefault ?? true,
    });
    
    const savedAddress = await this.addressRepository.save(address);
    
    this.geocodeUserAddressUseCase.execute({ addressId: savedAddress.id }).catch(console.error);

    return savedAddress;
  }
}
