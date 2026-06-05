import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RestaurantFacade } from "../../application/restaurant.facade";
import { RegisterRestaurantDto } from "../dtos/register-restaurant.dto";
import { UpdateRestaurantDto } from "../dtos/update-restaurant.dto";
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantController {
    constructor(private readonly restaurantFacade: RestaurantFacade) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerRestaurantDto: RegisterRestaurantDto) {
        const restaurant = await this.restaurantFacade.register(registerRestaurantDto);
        return {
            message: 'Restaurant registered successfully',
            id: restaurant.getId(),
        };
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: number, @Body() updateRestaurantDto: UpdateRestaurantDto) {
        await this.restaurantFacade.update(id, updateRestaurantDto);
        return {
            message: 'Restaurant updated successfully',
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: number) {
        await this.restaurantFacade.delete(id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list() {
        return this.restaurantFacade.list();
    }

}