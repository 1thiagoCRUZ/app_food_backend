import { Inject, Injectable, ConflictException } from "@nestjs/common";
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from "../ports/restaurant-repository.port";
import { RegisterRestaurantDto } from "../../presentation/dtos/register-restaurant.dto";
import { Restaurant } from "../../domain/entities/restaurant.entity";
import { CNPJ } from "../../domain/value-objects/cnpj.vo";
import type { StoragePort } from '../../../../shared/ports/storage.port';
import { STORAGE_PORT } from '../../../../shared/ports/storage.port';

@Injectable()
export class RegisterRestaurantUseCase {
    constructor(
        @Inject(RESTAURANT_REPOSITORY_PORT)
        private readonly restaurantRepository: RestaurantRepositoryPort,
        @Inject(STORAGE_PORT)
        private readonly storage: StoragePort,
    ) {}

    async execute(dto: RegisterRestaurantDto, file?: Express.Multer.File) {
        const existingRestaurant = await this.restaurantRepository.findByCNPJ(dto.cnpj);
        if (existingRestaurant) {
            throw new ConflictException('Restaurant with this cnpj already exists');
        }
        const restaurant = Restaurant.create({
            name: dto.name,
            cnpj: CNPJ.create(dto.cnpj),
            isOpen: dto.isOpen,
        });

        const savedRestaurant = await this.restaurantRepository.save(restaurant);

        if (file) {
            const ext = file.originalname.split('.').pop() || 'png';
            const url = await this.storage.uploadFile(file.buffer, `restaurants/${savedRestaurant.getId()}/cover.${ext}`, file.mimetype);
            savedRestaurant.updatePhoto(url);
            await this.restaurantRepository.save(savedRestaurant);
        }

        return savedRestaurant;
    }
}