import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { AdressSchema } from './address.schema';
@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 150 })
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ length: 11, unique: true, nullable: true })
  cpf?: string; 
  @Column({ length: 20, nullable: true })
  phone?: string; 
  @OneToMany(() => AdressSchema, (address) => address.user)
  addresses: AdressSchema[];
  @Column()
  passwordHash: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}