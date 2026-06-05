import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('deliveries')
export class DeliverySchema {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  orderId: number;
  @Column()
  courierId: number;
  @Column({ default: 'FINDING_COURIER' })
  status: string; 
    @Column('decimal', { precision: 10, scale: 8, nullable: true })
  destLat?: number;
    @Column('decimal', { precision: 11, scale: 8, nullable: true })
  destLng?: number;
    @Column({ nullable: true })
  distanceMeters?: number;
    @Column({ nullable: true })
  estimatedDurationSeconds?: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
