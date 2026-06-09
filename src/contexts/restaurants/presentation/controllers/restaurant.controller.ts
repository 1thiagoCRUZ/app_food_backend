import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, UseGuards, Request, ForbiddenException, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { RestaurantFacade } from "../../application/restaurant.facade";
import { RegisterRestaurantDto } from "../dtos/register-restaurant.dto";
import { UpdateRestaurantDto } from "../dtos/update-restaurant.dto";
import { CreateRestaurantAddressDto } from "../dtos/restaurant-address.dto";
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Restaurants')
@ApiBearerAuth()
@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantController {
    constructor(private readonly restaurantFacade: RestaurantFacade) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('photo'))
    async register(@Body() registerRestaurantDto: RegisterRestaurantDto, @UploadedFile() file?: Express.Multer.File) {
        const restaurant = await this.restaurantFacade.register(registerRestaurantDto, file);
        return {
            message: 'Restaurant registered successfully',
            id: restaurant.getId(),
        };
    }

    @Put(':id')
    @ApiConsumes('multipart/form-data')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('photo'))
    async update(@Param('id') id: number, @Body() updateRestaurantDto: UpdateRestaurantDto, @Request() req, @UploadedFile() file?: Express.Multer.File) {
        const myRestaurant = await this.restaurantFacade.getMyRestaurant(req.user.userId || req.user.sub);
        if (!myRestaurant || myRestaurant.id != id) {
            throw new ForbiddenException('Você só pode editar seu próprio restaurante');
        }
        await this.restaurantFacade.update(id, updateRestaurantDto, file);
        return {
            message: 'Restaurant updated successfully',
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: number, @Request() req) {
        const myRestaurant = await this.restaurantFacade.getMyRestaurant(req.user.userId || req.user.sub);
        if (!myRestaurant || myRestaurant.id != id) {
            throw new ForbiddenException('Você só pode excluir seu próprio restaurante');
        }
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
        return this.restaurantFacade.getMyRestaurant(req.user.userId || req.user.sub);
    }

    @Patch(':id/status')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ schema: { type: 'object', properties: { isOpen: { type: 'boolean' } } } })
    async toggleStatus(@Param('id') id: number, @Body('isOpen') isOpen: boolean, @Request() req) {
        if (isOpen === undefined) {
            throw new BadRequestException('isOpen is required');
        }
        const myRestaurant = await this.restaurantFacade.getMyRestaurant(req.user.userId || req.user.sub);
        if (!myRestaurant || myRestaurant.id != id) {
            throw new ForbiddenException('Você só pode alterar o status do seu próprio restaurante');
        }
        await this.restaurantFacade.toggleStatus(id, isOpen);
        return {
            message: 'Restaurant status updated successfully',
        };
    }

    @Post(':id/addresses')
    @HttpCode(HttpStatus.CREATED)
    async addAddress(@Param('id') id: number, @Body() createAddressDto: CreateRestaurantAddressDto, @Request() req) {
        const myRestaurant = await this.restaurantFacade.getMyRestaurant(req.user.userId || req.user.sub);
        if (!myRestaurant || myRestaurant.id != id) {
            throw new ForbiddenException('Você só pode adicionar endereço no seu próprio restaurante');
        }
        return this.restaurantFacade.addAddress(id, createAddressDto);
    }

    @Get(':id/addresses')
    @HttpCode(HttpStatus.OK)
    async listAddresses(@Param('id') id: number) {
        return this.restaurantFacade.listAddresses(id);
    }
}