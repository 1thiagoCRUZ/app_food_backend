import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { RestaurantRepositoryPort } from "../ports/restaurant-repository.port";
import { RESTAURANT_REPOSITORY_PORT } from "../ports/restaurant-repository.port";

@Injectable()
export class DeleteRestaurantUseCase {
    constructor(
        @Inject(RESTAURANT_REPOSITORY_PORT)
        private readonly restaurantRepository: RestaurantRepositoryPort,
    ) { }

    async execute(id: number): Promise<void> {
        const restaurant = await this.restaurantRepository.findById(id);
        if (!restaurant) {
            throw new NotFoundException('Restaurant not found');
        }
        await this.restaurantRepository.delete(id);
    }
}