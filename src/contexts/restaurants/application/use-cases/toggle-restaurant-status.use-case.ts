import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../ports/restaurant-repository.port';

@Injectable()
export class ToggleRestaurantStatusUseCase {
  constructor(
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort
  ) {}

  async execute(id: number, isOpen: boolean): Promise<void> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    restaurant.updateIsOpen(isOpen);
    await this.restaurantRepository.save(restaurant);
  }
}
