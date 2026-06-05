import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GEO_CODING_PORT } from '../../../../shared/ports/geo-coding.port';
import type { GeoCodingPort } from '../../../../shared/ports/geo-coding.port';
import { AdressSchema } from '../../infrastructure/database/address.schema';
export interface GeocodeAddressInput {
  addressId: number;
}
@Injectable()
export class GeocodeUserAddressUseCase {
  private readonly logger = new Logger(GeocodeUserAddressUseCase.name);
  constructor(
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
    @Inject(GEO_CODING_PORT)
    private readonly geoCodingService: GeoCodingPort,
  ) {}
  async execute(input: GeocodeAddressInput): Promise<{ lat: number; lng: number } | null> {
    const address = await this.addressRepository.findOne({ where: { id: input.addressId } });
    if (!address) {
      throw new NotFoundException(`Endereço ID ${input.addressId} não encontrado`);
    }
    const fullAddress = `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, Brasil`;
    this.logger.log(`Geocodificando: "${fullAddress}"`);
    const coordinates = await this.geoCodingService.geocodeAddress(fullAddress);
    if (!coordinates) {
      this.logger.warn(`Não foi possível geocodificar o endereço: "${fullAddress}"`);
      return null;
    }
    await this.addressRepository.update(address.id, {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
    this.logger.log(`Coordenadas salvas para endereço ID ${address.id}: lat=${coordinates.lat}, lng=${coordinates.lng}`);
    return coordinates;
  }
}
