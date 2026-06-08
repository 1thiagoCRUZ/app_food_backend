import { Inject, Injectable } from "@nestjs/common";
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from "../ports/restaurant-repository.port";
import { UpdateRestaurantDto } from "../../presentation/dtos/update-restaurant.dto";
import { CNPJ } from "../../domain/value-objects/cnpj.vo";
import type { StoragePort } from '../../../../shared/ports/storage.port';
import { STORAGE_PORT } from '../../../../shared/ports/storage.port';

@Injectable()
export class UpdateRestaurantUseCase {
    constructor(
        @Inject(RESTAURANT_REPOSITORY_PORT)
        private readonly restaurantRepository: RestaurantRepositoryPort,
        @Inject(STORAGE_PORT)
        private readonly storage: StoragePort,
    ) {}

    async execute(id: number, dto: UpdateRestaurantDto, file?: Express.Multer.File): Promise<void> {
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
        if (file) {
            const ext = file.originalname.split('.').pop() || 'png';
            const url = await this.storage.uploadFile(file.buffer, `restaurants/${restaurant.getId()}/cover.${ext}`, file.mimetype);
            restaurant.updatePhoto(url);
        }

        await this.restaurantRepository.save(restaurant);
    }
}