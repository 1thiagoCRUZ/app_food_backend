import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_PORT, type ProductRepositoryPort } from '../ports/product-repository.port';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';
import { STORAGE_PORT, type StoragePort } from '../../../../shared/ports/storage.port';
import { UpdateProductDto } from '../../presentation/dtos/product.dto';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
    @Inject(STORAGE_PORT)
    private readonly storage: StoragePort,
  ) {}

  async execute(id: number, dto: UpdateProductDto, userId: number, role: string, file?: Express.Multer.File): Promise<Product> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem editar produtos');
    }

    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Produto não encontrado');

    const restaurant = await this.restaurantRepository.findById(product.getRestaurantId());
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    if (dto.name) product.updateName(dto.name);
    if (dto.description) product.updateDescription(dto.description);
    if (dto.price !== undefined) product.updatePrice(dto.price);
    if (dto.available !== undefined) product.updateAvailable(dto.available);
    if (dto.stock !== undefined) product.updateStock(dto.stock);

    if (file) {
      const ext = file.originalname.split('.').pop() || 'png';
      const url = await this.storage.uploadFile(
        file.buffer, 
        `restaurants/${product.getRestaurantId()}/products/${product.getId()}.${ext}`, 
        file.mimetype
      );
      product.updateImage(url);
    }

    return this.productRepository.save(product);
  }
}
