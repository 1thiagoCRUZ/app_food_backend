import { Inject, Injectable } from "@nestjs/common";
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from "../ports/restaurant-repository.port";
import { UpdateRestaurantDto } from "../../presentation/dtos/update-restaurant.dto";
import { CNPJ } from "../../domain/value-objects/cnpj.vo";

@Injectable()
export class UpdateRestaurantUseCase {
    constructor(@Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort) {}

    async execute(id: number, dto: UpdateRestaurantDto): Promise<void> {
        const restaurant = await this.restaurantRepository.findById(id);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }
        if (dto.name) {
            restaurant.updateName(dto.name);
        }
        if (dto.cnpj) {
            restaurant.updateCNPJ(CNPJ.create(dto.cnpj));
        }
        if (dto.isOpen) {
            restaurant.updateIsOpen(dto.isOpen);
        }

        await this.restaurantRepository.save(restaurant);
    }
}