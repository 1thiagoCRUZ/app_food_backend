import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourierSchema } from './courier.schema';
import { Courier } from '../../domain/entities/courier.entity';

@Injectable()
export class CourierRepository {
  constructor(
    @InjectRepository(CourierSchema)
    private readonly repository: Repository<CourierSchema>,
  ) {}

  private toDomain(schema: CourierSchema): Courier {
    return Courier.create({
      id: schema.id,
      userId: schema.userId,
      isOnline: schema.isOnline,
      currentLat: schema.currentLat ? Number(schema.currentLat) : undefined,
      currentLng: schema.currentLng ? Number(schema.currentLng) : undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  async save(courier: Courier): Promise<Courier> {
    const schema = this.repository.create({
      id: courier.getId(),
      userId: courier.getUserId(),
      isOnline: courier.getIsOnline(),
      currentLat: courier.getCurrentLat(),
      currentLng: courier.getCurrentLng(),
    });

    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findByUserId(userId: number): Promise<Courier | null> {
    const schema = await this.repository.findOne({ where: { userId } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findAll(): Promise<Courier[]> {
    const schemas = await this.repository.find();
    return schemas.map(schema => this.toDomain(schema));
  }
}
