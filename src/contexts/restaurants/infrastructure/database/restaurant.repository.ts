import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantRepositoryPort } from '../../application/ports/restaurant-repository.port';
import { RestaurantSchema } from './restaurant.schema';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import { CNPJ } from '../../domain/value-objects/cnpj.vo';

@Injectable()
export class RestaurantRepository implements RestaurantRepositoryPort {
  constructor(
    @InjectRepository(RestaurantSchema)
    private readonly repository: Repository<RestaurantSchema>,
  ) {}

  private toDomain(schema: RestaurantSchema): Restaurant {
    return Restaurant.create({
      id: schema.id,
      name: schema.name,
      cnpj: CNPJ.create(schema.cnpj),
      isOpen: schema.isOpen,
      ownerId: schema.ownerId,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  async save(restaurant: Restaurant): Promise<Restaurant> {
    const schema = this.repository.create({
      id: restaurant.getId(),
      name: restaurant.getName(),
      cnpj: restaurant.getCNPJ().getValue(),
      isOpen: restaurant.getIsOpen(),
      ownerId: restaurant.getOwnerId(),
    });
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<Restaurant | null> {
    const schema = await this.repository.findOne({ where: { id } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByCNPJ(cnpj: string): Promise<Restaurant | null> {
    const schema = await this.repository.findOne({ where: { cnpj } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Restaurant[]> {
    const schemas = await this.repository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }
}
