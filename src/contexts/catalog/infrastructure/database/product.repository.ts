import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSchema } from './product.schema';
import { ProductRepositoryPort } from '../../application/ports/product-repository.port';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly repository: Repository<ProductSchema>,
  ) {}

  private toDomain(schema: ProductSchema): Product {
    return Product.create({
      id: schema.id,
      restaurantId: schema.restaurantId,
      name: schema.name,
      description: schema.description,
      price: Number(schema.price),
      image: schema.image,
      available: schema.available,
      stock: schema.stock,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  private toSchema(product: Product): ProductSchema {
    const schema = new ProductSchema();
    if (product.getId()) {
      schema.id = product.getId() as number;
    }
    schema.restaurantId = product.getRestaurantId();
    schema.name = product.getName();
    schema.description = product.getDescription();
    schema.price = product.getPrice();
    schema.image = product.getImage() || undefined;
    schema.available = product.getAvailable();
    schema.stock = product.getStock();
    return schema;
  }

  async save(product: Product): Promise<Product> {
    const schema = this.toSchema(product);
    const savedSchema = await this.repository.save(schema);
    return this.toDomain(savedSchema);
  }

  async findById(id: number): Promise<Product | null> {
    const schema = await this.repository.findOne({ where: { id } });
    if (!schema) return null;
    return this.toDomain(schema);
  }

  async findByRestaurantId(restaurantId: number): Promise<Product[]> {
    const schemas = await this.repository.find({ where: { restaurantId } });
    return schemas.map((s) => this.toDomain(s));
  }

  async findAll(): Promise<Product[]> {
    const schemas = await this.repository.find();
    return schemas.map((s) => this.toDomain(s));
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
