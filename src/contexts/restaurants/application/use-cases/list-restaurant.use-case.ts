import { Inject, Injectable } from "@nestjs/common";
import{ RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from "../ports/restaurant-repository.port";

@Injectable()
export class ListRestaurantUseCase {
    constructor(
        @Inject(RESTAURANT_REPOSITORY_PORT)
        private readonly restaurantRepository: RestaurantRepositoryPort
    ) {}

    async execute() {
        const restaurants = await this.restaurantRepository.findAll();
        return restaurants.map(restaurant => ({
            id: restaurant.getId(),
            name: restaurant.getName(),
            cnpj: restaurant.getCNPJ().getValue(),
            isOpen: restaurant.getIsOpen(),
            createdAt: restaurant.getCreatedAt(),
            updatedAt: restaurant.getUpdatedAt()
        }));
    }
}