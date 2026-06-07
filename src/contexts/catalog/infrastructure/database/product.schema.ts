import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('products')
export class ProductSchema {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  restaurantId: number; 
  @Column()
  name: string;
  @Column()
  description: string;
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
  @Column('text', { nullable: true })
  image?: string;
  @Column({ default: true })
  available: boolean;
  @Column({ default: 0 })
  stock: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
