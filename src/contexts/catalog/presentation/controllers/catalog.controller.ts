import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CatalogFacade } from '../../application/catalog.facade';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalogFacade: CatalogFacade) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductDto) {
    const product = await this.catalogFacade.create(dto);
    return { message: 'Produto criado com sucesso', id: product.id };
  }

  @Get()
  async list(@Query('restaurantId') restaurantId?: number) {
    return this.catalogFacade.list(restaurantId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    await this.catalogFacade.update(id, dto);
    return { message: 'Produto atualizado com sucesso' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    await this.catalogFacade.delete(id);
  }
}
