import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { OrderSchema } from './order.schema';
import { OrderItemSchema } from './order-item.schema';
import { OrderRepositoryPort } from '../../application/ports/order-repository.port';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class OrderRepository implements OrderRepositoryPort {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly repository: Repository<OrderSchema>,
  ) {}

  private toDomain(schema: OrderSchema): Order {
    return Order.create({
      id: schema.id,
      userId: schema.userId,
      restaurantId: schema.restaurantId,
      courierId: schema.courierId || undefined,
      courierFee: schema.courierFee ? Number(schema.courierFee) : undefined,
      total: Number(schema.total),
      status: schema.status as any,
      deliveryVerificationCode: schema.deliveryVerificationCode || undefined,
      pickupVerificationCode: schema.pickupVerificationCode || undefined,
      items: schema.items ? schema.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })) : [],
    });
  }

  private toSchema(order: Order): OrderSchema {
    const schema = new OrderSchema();
    if (order.getId()) {
      schema.id = order.getId() as number;
    }
    schema.userId = order.getUserId();
    schema.restaurantId = order.getRestaurantId();
    schema.courierId = order.getCourierId() || undefined;
    schema.courierFee = order.getCourierFee() || undefined;
    schema.total = order.getTotal();
    schema.status = order.getStatus();
    schema.deliveryVerificationCode = order.getDeliveryVerificationCode() || undefined;
    schema.pickupVerificationCode = order.getPickupVerificationCode() || undefined;
    
    if (order.getItems()) {
      schema.items = order.getItems().map(item => {
        const itemSchema = new OrderItemSchema();
        itemSchema.productId = item.productId;
        itemSchema.name = item.name;
        itemSchema.price = item.price;
        itemSchema.quantity = item.quantity;
        itemSchema.order = schema;
        return itemSchema;
      });
    }
    return schema;
  }

  async save(order: Order): Promise<Order> {
    const schema = this.toSchema(order);
    const savedSchema = await this.repository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: number): Promise<Order | null> {
    const schema = await this.repository.findOne({ 
      where: { id },
      relations: ['items']
    });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.repository.update(id, { status });
  }

  async findAvailableOrders(): Promise<Order[]> {
    const schemas = await this.repository.find({
      where: { status: 'READY_FOR_PICKUP', courierId: IsNull() },
      relations: ['items']
    });
    return schemas.map(s => this.toDomain(s));
  }

  async findCourierOrders(courierId: number): Promise<Order[]> {
    const schemas = await this.repository.find({
      where: { courierId },
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
    return schemas.map(s => this.toDomain(s));
  }
}
