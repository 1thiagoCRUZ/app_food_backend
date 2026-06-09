import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { PRODUCT_REPOSITORY_PORT, type ProductRepositoryPort } from '../ports/product-repository.port';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string): Promise<void> {
    if (role !== 'RESTAURANT') {
      throw new ForbiddenException('Apenas restaurantes podem deletar produtos');
    }

    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Produto não encontrado');

    const restaurant = await this.restaurantRepository.findById(product.getRestaurantId());
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado. Você não é o dono deste restaurante');
    }

    await this.productRepository.delete(id);
  }
}
