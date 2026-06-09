import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CatalogFacade } from '../../application/catalog.facade';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { JwtAuthGuard } from '../../../users/infrastructure/auth/jwt-auth.guard';

import { CurrentUser } from '../../../users/infrastructure/auth/current-user.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalogFacade: CatalogFacade) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Criar um novo produto no catálogo do restaurante' })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async create(@CurrentUser('userId') userId: number, @CurrentUser('role') role: string, @Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    const product = await this.catalogFacade.create(dto, userId, role, file);
    return { message: 'Produto criado com sucesso', id: product.getId() };
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos, opcionalmente filtrando por restaurante' })
  async list(@Query('restaurantId') restaurantId?: number) {
    return this.catalogFacade.list(restaurantId);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar um produto existente' })
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string, @Body() dto: UpdateProductDto, @UploadedFile() file?: Express.Multer.File) {
    await this.catalogFacade.update(id, dto, userId, role, file);
    return { message: 'Produto atualizado com sucesso' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto do catálogo' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number, @CurrentUser('userId') userId: number, @CurrentUser('role') role: string) {
    await this.catalogFacade.delete(id, userId, role);
  }
}
