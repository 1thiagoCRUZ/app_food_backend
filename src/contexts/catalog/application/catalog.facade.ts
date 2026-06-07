import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSchema } from '../infrastructure/database/product.schema';
import { CreateProductDto, UpdateProductDto } from '../presentation/dtos/product.dto';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../restaurants/application/ports/restaurant-repository.port';

@Injectable()
export class CatalogFacade {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly productRepository: Repository<ProductSchema>,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async create(dto: CreateProductDto, userId: number, role: string) {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem criar produtos');
    }
    const restaurant = await this.restaurantRepository.findById(dto.restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    const product = this.productRepository.create({
      restaurantId: dto.restaurantId,
      name: dto.name,
      description: dto.description || '',
      price: dto.price,
      image: dto.image,
      available: dto.available !== undefined ? dto.available : true,
      stock: dto.stock !== undefined ? dto.stock : 0,
    });
    return this.productRepository.save(product);
  }

  async list(restaurantId?: number) {
    if (restaurantId) {
      return this.productRepository.find({ where: { restaurantId } });
    }
    return this.productRepository.find();
  }

  async update(id: number, dto: UpdateProductDto, userId: number, role: string) {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem editar produtos');
    }

    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const restaurant = await this.restaurantRepository.findById(product.restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    if (dto.name) product.name = dto.name;
    if (dto.description) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.image !== undefined) product.image = dto.image;
    if (dto.available !== undefined) product.available = dto.available;
    if (dto.stock !== undefined) product.stock = dto.stock;

    return this.productRepository.save(product);
  }

  async delete(id: number, userId: number, role: string) {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem deletar produtos');
    }

    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const restaurant = await this.restaurantRepository.findById(product.restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    await this.productRepository.delete(id);
  }
}
