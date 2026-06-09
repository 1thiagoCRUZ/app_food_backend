import { Product } from '../../domain/entities/product.entity';

export const PRODUCT_REPOSITORY_PORT = 'PRODUCT_REPOSITORY_PORT';

export interface ProductRepositoryPort {
  findById(id: number): Promise<Product | null>;
  findByRestaurantId(restaurantId: number): Promise<Product[]>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
