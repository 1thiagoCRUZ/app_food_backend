import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdressSchema } from '../../infrastructure/database/address.schema';
import { CreateRestaurantAddressDto } from '../../presentation/dtos/restaurant-address.dto';
import { GeocodeRestaurantAddressUseCase } from './geocode-restaurant-address.usecase';

@Injectable()
export class AddRestaurantAddressUseCase {
  constructor(
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
    private readonly geocodeRestaurantAddressUseCase: GeocodeRestaurantAddressUseCase,
  ) {}

  async execute(restaurantId: number, dto: CreateRestaurantAddressDto) {
    if (dto.isDefault) {
      await this.addressRepository.update({ restaurantId }, { isDefault: false });
    }
    
    const address = this.addressRepository.create({
      ...dto,
      restaurantId,
      isDefault: dto.isDefault ?? true,
    });
    
    const savedAddress = await this.addressRepository.save(address);
    
    // Dispara a geocodificação de forma assíncrona
    this.geocodeRestaurantAddressUseCase.execute({ addressId: savedAddress.id }).catch(console.error);

    return savedAddress;
  }
}
