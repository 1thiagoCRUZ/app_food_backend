import { Injectable } from "@nestjs/common";
import { RegisterRestaurantUseCase } from "./use-cases/register-restaurant.use-case";
import { UpdateRestaurantUseCase } from "./use-cases/update-restaurant.use-case";
import { DeleteRestaurantUseCase } from "./use-cases/delete-restaurant.use-case";
import { ListRestaurantUseCase } from "./use-cases/list-restaurant.use-case";
import { RegisterRestaurantDto } from "../presentation/dtos/register-restaurant.dto";
import { UpdateRestaurantDto } from "../presentation/dtos/update-restaurant.dto";

@Injectable()
export class RestaurantFacade {
    constructor(private readonly registerRestaurantUseCase: RegisterRestaurantUseCase,
    private readonly updateRestaurantUseCase: UpdateRestaurantUseCase,
    private readonly deleteRestaurantUseCase: DeleteRestaurantUseCase,
    private readonly listRestaurantUseCase: ListRestaurantUseCase) {}

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
}