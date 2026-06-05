import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSchema } from '../infrastructure/database/product.schema';
import { CreateProductDto, UpdateProductDto } from '../presentation/dtos/product.dto';

@Injectable()
export class CatalogFacade {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly productRepository: Repository<ProductSchema>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productRepository.create({
      restaurantId: dto.restaurantId,
      name: dto.name,
      description: dto.description || '',
      price: dto.price,
    });
    return this.productRepository.save(product);
  }

  async list(restaurantId?: number) {
    if (restaurantId) {
      return this.productRepository.find({ where: { restaurantId } });
    }
    return this.productRepository.find();
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    if (dto.name) product.name = dto.name;
    if (dto.description) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;

    return this.productRepository.save(product);
  }

  async delete(id: number) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Produto não encontrado');
    }
  }
}
