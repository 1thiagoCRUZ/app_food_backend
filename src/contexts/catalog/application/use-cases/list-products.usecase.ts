import { Injectable, Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_PORT, type ProductRepositoryPort } from '../ports/product-repository.port';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(restaurantId?: number): Promise<Product[]> {
    if (restaurantId) {
      return this.productRepository.findByRestaurantId(restaurantId);
    }
    return this.productRepository.findAll();
  }
}
