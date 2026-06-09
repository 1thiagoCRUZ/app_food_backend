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
      cnh: schema.cnh || undefined,
      vehiclePlate: schema.vehiclePlate || undefined,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toSchema(courier: Courier): CourierSchema {
    const schema = new CourierSchema();
    if (courier.getId()) {
      schema.id = courier.getId()!;
    }
    schema.userId = courier.getUserId();
    schema.isOnline = courier.getIsOnline();
    schema.currentLat = courier.getCurrentLat();
    schema.currentLng = courier.getCurrentLng();
    schema.cnh = courier.getCnh() || undefined;
    schema.vehiclePlate = courier.getVehiclePlate() || undefined;
    return schema;
  }

  async save(courier: Courier): Promise<Courier> {
    const schema = this.toSchema(courier);
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
