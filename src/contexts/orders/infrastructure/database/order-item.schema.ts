import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrderSchema } from './order.schema';
@Entity('order_items')
export class OrderItemSchema {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  name: string; 
  @Column('decimal', { precision: 10, scale: 2 })
  price: number; 
  @Column()
  quantity: number;
  @ManyToOne(() => OrderSchema, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order: OrderSchema;
}
