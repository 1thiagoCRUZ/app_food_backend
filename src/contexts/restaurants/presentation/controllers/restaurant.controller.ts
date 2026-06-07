import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, UseGuards, Request } from "@nestjs/common";
import { RestaurantFacade } from "../../application/restaurant.facade";
import { RegisterRestaurantDto } from "../dtos/register-restaurant.dto";
import { UpdateRestaurantDto } from "../dtos/update-restaurant.dto";
import { CreateRestaurantAddressDto } from "../dtos/restaurant-address.dto";
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Restaurants')
@ApiBearerAuth()
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

    @Get('my')
    @HttpCode(HttpStatus.OK)
    async getMy(@Request() req) {
        return this.restaurantFacade.getMyRestaurant(req.user.sub);
    }

    @Patch(':id/status')
    @HttpCode(HttpStatus.OK)
    async toggleStatus(@Param('id') id: number, @Body('isOpen') isOpen: boolean) {
        await this.restaurantFacade.toggleStatus(id, isOpen);
        return {
            message: 'Restaurant status updated successfully',
        };
    }

    @Post(':id/addresses')
    @HttpCode(HttpStatus.CREATED)
    async addAddress(@Param('id') id: number, @Body() createAddressDto: CreateRestaurantAddressDto) {
        return this.restaurantFacade.addAddress(id, createAddressDto);
    }

    @Get(':id/addresses')
    @HttpCode(HttpStatus.OK)
    async listAddresses(@Param('id') id: number) {
        return this.restaurantFacade.listAddresses(id);
    }
}