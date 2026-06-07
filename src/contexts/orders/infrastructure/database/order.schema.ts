import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItemSchema } from './order-item.schema';
@Entity('orders')
export class OrderSchema {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number; 

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  customerPhone?: string;

  @Column()
  restaurantId: number; 

  @Column({ nullable: true })
  courierId?: number; 

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  courierFee?: number;

  @Column({ nullable: true })
  deliveryAddressId: number; 

  @Column({ nullable: true })
  deliveryStreet?: string;

  @Column({ nullable: true })
  deliveryCity?: string;

  @Column({ nullable: true })
  deliveryState?: string;

  @Column({ nullable: true })
  deliveryZipCode?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @OneToMany(() => OrderItemSchema, item => item.order, { cascade: true })
  items: OrderItemSchema[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount?: number;

  @Column({ nullable: true })
  couponCode?: string;

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
