import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GEO_CODING_PORT } from '../../../../shared/ports/geo-coding.port';
import type { GeoCodingPort } from '../../../../shared/ports/geo-coding.port';
import { AdressSchema } from '../../infrastructure/database/address.schema';
export interface GeocodeRestaurantAddressInput {
  addressId: number;
}
@Injectable()
export class GeocodeRestaurantAddressUseCase {
  private readonly logger = new Logger(GeocodeRestaurantAddressUseCase.name);
  constructor(
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
    @Inject(GEO_CODING_PORT)
    private readonly geoCodingService: GeoCodingPort,
  ) {}
  async execute(input: GeocodeRestaurantAddressInput): Promise<{ lat: number; lng: number } | null> {
    const address = await this.addressRepository.findOne({ where: { id: input.addressId } });
    if (!address) {
      throw new NotFoundException(`Endereço de restaurante ID ${input.addressId} não encontrado`);
    }
    const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, Brasil`;
    this.logger.log(`Geocodificando endereço do restaurante: "${fullAddress}"`);
    const coordinates = await this.geoCodingService.geocodeAddress(fullAddress);
    if (!coordinates) {
      this.logger.warn(`Não foi possível geocodificar: "${fullAddress}"`);
      return null;
    }
    await this.addressRepository.update(address.id, {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
    this.logger.log(`Coordenadas salvas para endereço de restaurante ID ${address.id}`);
    return coordinates;
  }
}
