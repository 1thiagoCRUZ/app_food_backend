import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_PORT, type ProductRepositoryPort } from '../ports/product-repository.port';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';
import { STORAGE_PORT, type StoragePort } from '../../../../shared/ports/storage.port';
import { CreateProductDto } from '../../presentation/dtos/product.dto';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
    @Inject(STORAGE_PORT)
    private readonly storage: StoragePort,
  ) {}

  async execute(dto: CreateProductDto, userId: number, role: string, file?: Express.Multer.File): Promise<Product> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem criar produtos');
    }

    const restaurant = await this.restaurantRepository.findById(dto.restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    const product = Product.create({
      restaurantId: dto.restaurantId,
      name: dto.name,
      description: dto.description || '',
      price: dto.price,
      image: dto.image,
      available: dto.available !== undefined ? dto.available : true,
      stock: dto.stock !== undefined ? dto.stock : 0,
    });

    const savedProduct = await this.productRepository.save(product);

    if (file && savedProduct.getId()) {
      const ext = file.originalname.split('.').pop() || 'png';
      const url = await this.storage.uploadFile(
        file.buffer, 
        `restaurants/${dto.restaurantId}/products/${savedProduct.getId()}.${ext}`, 
        file.mimetype
      );
      savedProduct.updateImage(url);
      return this.productRepository.save(savedProduct);
    }

    return savedProduct;
  }
}
