import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserSchema } from "./user.schema";

@Entity('addresses')
export class AdressSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => UserSchema, (user) => user.addresses)
    @JoinColumn({ name: 'userId' })
    user: UserSchema;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zipCode: string;

    @Column({ default: true })
    isDefault: boolean;

    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column('decimal', { precision: 11, scale: 8, nullable: true })
    longitude: number;
}