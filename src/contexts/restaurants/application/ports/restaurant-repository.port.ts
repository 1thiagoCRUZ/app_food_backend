import { Restaurant } from "../../domain/entities/restaurant.entity";

export interface RestaurantRepositoryPort {
    save(restaurant: Restaurant): Promise<Restaurant>;
    findById(id: number): Promise<Restaurant | null>;
    findByCNPJ(cnpj: string): Promise<Restaurant | null>;
    delete(id: number): Promise<void>;
    findAll(): Promise<Restaurant[]>;
}

export const RESTAURANT_REPOSITORY_PORT = 'RESTAURANT_REPOSITORY_PORT';