import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RestaurantSchema } from './restaurant.schema';

@Entity('coupons')
export class CouponSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @ManyToOne(() => RestaurantSchema)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantSchema;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column()
  value: string;

  @Column('decimal', { precision: 10, scale: 2 })
  min: number;

  @Column({ default: 0 })
  uses: number;

  @Column()
  limit: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
