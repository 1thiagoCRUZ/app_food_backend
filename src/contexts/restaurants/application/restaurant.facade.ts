import { Injectable } from "@nestjs/common";
import { RegisterRestaurantUseCase } from "./use-cases/register-restaurant.use-case";
import { UpdateRestaurantUseCase } from "./use-cases/update-restaurant.use-case";
import { DeleteRestaurantUseCase } from "./use-cases/delete-restaurant.use-case";
import { ListRestaurantUseCase } from "./use-cases/list-restaurant.use-case";
import { ToggleRestaurantStatusUseCase } from "./use-cases/toggle-restaurant-status.use-case";
import { RegisterRestaurantDto } from "../presentation/dtos/register-restaurant.dto";
import { UpdateRestaurantDto } from "../presentation/dtos/update-restaurant.dto";
import { GetMyRestaurantUseCase } from "./use-cases/get-my-restaurant.use-case";
import { CreateRestaurantAddressDto } from "../presentation/dtos/restaurant-address.dto";
import { AddRestaurantAddressUseCase } from "./use-cases/add-restaurant-address.use-case";
import { ListRestaurantAddressesUseCase } from "./use-cases/list-restaurant-addresses.use-case";

@Injectable()
export class RestaurantFacade {
    constructor(
        private readonly registerRestaurantUseCase: RegisterRestaurantUseCase,
        private readonly updateRestaurantUseCase: UpdateRestaurantUseCase,
        private readonly deleteRestaurantUseCase: DeleteRestaurantUseCase,
        private readonly listRestaurantUseCase: ListRestaurantUseCase,
        private readonly toggleRestaurantStatusUseCase: ToggleRestaurantStatusUseCase,
        private readonly getMyRestaurantUseCase: GetMyRestaurantUseCase,
        private readonly addRestaurantAddressUseCase: AddRestaurantAddressUseCase,
        private readonly listRestaurantAddressesUseCase: ListRestaurantAddressesUseCase
    ) {}

    register(dto: RegisterRestaurantDto) {
        return this.registerRestaurantUseCase.execute(dto);
    }

    update(id: number, dto: UpdateRestaurantDto) {
        return this.updateRestaurantUseCase.execute(id, dto);
    }

    delete(id: number) {
        return this.deleteRestaurantUseCase.execute(id);
    }

    list() {
        return this.listRestaurantUseCase.execute();
    }

    getMyRestaurant(ownerId: number) {
        return this.getMyRestaurantUseCase.execute(ownerId);
    }

    toggleStatus(id: number, isOpen: boolean) {
        return this.toggleRestaurantStatusUseCase.execute(id, isOpen);
    }

    addAddress(restaurantId: number, dto: CreateRestaurantAddressDto) {
        return this.addRestaurantAddressUseCase.execute(restaurantId, dto);
    }

    listAddresses(restaurantId: number) {
        return this.listRestaurantAddressesUseCase.execute(restaurantId);
    }
}