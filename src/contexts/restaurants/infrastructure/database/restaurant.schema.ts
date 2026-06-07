import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AdressSchema } from './address.schema';


@Entity('restaurants')
export class RestaurantSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cnpj: string;

  @Column({ default: false })
  isOpen: boolean;

  @OneToMany(() => AdressSchema, (address) => address.restaurant, { cascade: true })
  addresses: AdressSchema[];

  @Column({ nullable: true })
  ownerId: number;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
