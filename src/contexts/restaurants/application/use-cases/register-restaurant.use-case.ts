import { Inject, Injectable } from "@nestjs/common";
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from "../ports/restaurant-repository.port";
import { RegisterRestaurantDto } from "../../presentation/dtos/register-restaurant.dto";
import { Restaurant } from "../../domain/entities/restaurant.entity";
import { CNPJ } from "../../domain/value-objects/cnpj.vo";

@Injectable()
export class RegisterRestaurantUseCase {
    constructor(
        @Inject(RESTAURANT_REPOSITORY_PORT)
        private readonly restaurantRepository: RestaurantRepositoryPort
    ) {}

    async execute(dto: RegisterRestaurantDto) {
        const existingRestaurant = await this.restaurantRepository.findByCNPJ(dto.cnpj);
        if (existingRestaurant) {
            throw new Error('Restaurant with this cnpj already exists');
        }
        const restaurant = Restaurant.create({
            name: dto.name,
            cnpj: CNPJ.create(dto.cnpj),
            isOpen: dto.isOpen,
            photo: dto.photo,
        });

        return this.restaurantRepository.save(restaurant);
    }
}