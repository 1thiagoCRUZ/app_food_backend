import { Order } from '../../domain/entities/order.entity';

export interface OrderRepositoryPort {
  save(order: Order): Promise<Order>;
  findById(id: number): Promise<Order | null>;
  updateStatus(id: number, status: string): Promise<void>;
  findAvailableOrders(): Promise<Order[]>;
  findCourierOrders(courierId: number): Promise<Order[]>;
}

export const ORDER_REPOSITORY_PORT = 'ORDER_REPOSITORY_PORT';
