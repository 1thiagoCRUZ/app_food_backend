import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItemSchema } from './order-item.schema';
@Entity('orders')
export class OrderSchema {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number; 
  @Column()
  restaurantId: number; 

  @Column({ nullable: true })
  courierId?: number; 

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  courierFee?: number;

  @Column({ nullable: true })
  deliveryAddressId: number; 
  @OneToMany(() => OrderItemSchema, item => item.order, { cascade: true })
  items: OrderItemSchema[];
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;
  @Column({ default: 'AWAITING_PAYMENT' })
  status: string;
  @Column({ length: 4, nullable: true })
  deliveryVerificationCode?: string; 
  @Column({ length: 4, nullable: true })
  pickupVerificationCode?: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
