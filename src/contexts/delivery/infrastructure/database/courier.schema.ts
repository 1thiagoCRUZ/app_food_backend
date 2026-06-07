import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('couriers')
export class CourierSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @Column({ default: false })
  isOnline: boolean;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  currentLat?: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  currentLng?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
