import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../presentation/dtos/product.dto';
import { CreateProductUseCase } from './use-cases/create-product.usecase';
import { UpdateProductUseCase } from './use-cases/update-product.usecase';
import { DeleteProductUseCase } from './use-cases/delete-product.usecase';
import { ListProductsUseCase } from './use-cases/list-products.usecase';
import { GetProductUseCase } from './use-cases/get-product.usecase';

@Injectable()
export class CatalogFacade {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  async create(dto: CreateProductDto, userId: number, role: string, file?: Express.Multer.File) {
    return this.createProductUseCase.execute(dto, userId, role, file);
  }

  async list(restaurantId?: number) {
    return this.listProductsUseCase.execute(restaurantId);
  }

  async getById(id: number) {
    return this.getProductUseCase.execute(id);
  }

  async update(id: number, dto: UpdateProductDto, userId: number, role: string, file?: Express.Multer.File) {
    return this.updateProductUseCase.execute(id, dto, userId, role, file);
  }

  async delete(id: number, userId: number, role: string) {
    return this.deleteProductUseCase.execute(id, userId, role);
  }
}
