import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogFacade } from '../../application/catalog.facade';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalogFacade: CatalogFacade) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto no catálogo do restaurante' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductDto) {
    const product = await this.catalogFacade.create(dto);
    return { message: 'Produto criado com sucesso', id: product.id };
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos, opcionalmente filtrando por restaurante' })
  async list(@Query('restaurantId') restaurantId?: number) {
    return this.catalogFacade.list(restaurantId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produto existente' })
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    await this.catalogFacade.update(id, dto);
    return { message: 'Produto atualizado com sucesso' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto do catálogo' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    await this.catalogFacade.delete(id);
  }
}
