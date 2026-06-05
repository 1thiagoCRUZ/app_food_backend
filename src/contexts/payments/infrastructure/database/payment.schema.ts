import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('payments')
export class PaymentSchema {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  orderId: number;
  @Column({ unique: true })
  transactionId: string; 
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  @Column()
  method: string;
  @Column({ default: 'PENDING' })
  status: string; 
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
