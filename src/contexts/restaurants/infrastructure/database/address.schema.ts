import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { RestaurantSchema } from "./restaurant.schema";

@Entity('restaurant_addresses')
export class AdressSchema {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    restaurantId: number;

    @ManyToOne(() => RestaurantSchema, (restaurant) => restaurant.addresses)
    @JoinColumn({ name: 'restaurantId' })
    restaurant: RestaurantSchema;

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