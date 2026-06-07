import { Injectable, Inject } from '@nestjs/common';
import type { RestaurantRepositoryPort } from '../ports/restaurant-repository.port';
import { RESTAURANT_REPOSITORY_PORT } from '../ports/restaurant-repository.port';

@Injectable()
export class GetMyRestaurantUseCase {
    constructor(
        @Inject(RESTAURANT_REPOSITORY_PORT)
        private readonly restaurantRepository: RestaurantRepositoryPort
    ) {}

    async execute(ownerId: number) {
        const restaurants = await this.restaurantRepository.findAll();
        const myRestaurant = restaurants.find(r => (r as any).getOwnerId && (r as any).getOwnerId() === ownerId) || restaurants[0];
        
        return {
            id: myRestaurant.getId(),
            name: myRestaurant.getName(),
            cnpj: myRestaurant.getCNPJ().getValue(),
            isOpen: myRestaurant.getIsOpen()
        };
    }
}
