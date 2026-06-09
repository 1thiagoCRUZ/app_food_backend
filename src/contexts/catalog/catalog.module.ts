import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSchema } from './infrastructure/database/product.schema';
import { CatalogFacade } from './application/catalog.facade';
import { CatalogController } from './presentation/controllers/catalog.controller';

import { RestaurantModule } from '../restaurants/restaurant.module';
import { SharedModule } from '../../shared/shared.module';

import { ProductRepository } from './infrastructure/database/product.repository';
import { PRODUCT_REPOSITORY_PORT } from './application/ports/product-repository.port';
import { CreateProductUseCase } from './application/use-cases/create-product.usecase';
import { UpdateProductUseCase } from './application/use-cases/update-product.usecase';
import { DeleteProductUseCase } from './application/use-cases/delete-product.usecase';
import { ListProductsUseCase } from './application/use-cases/list-products.usecase';
import { GetProductUseCase } from './application/use-cases/get-product.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductSchema]),
    RestaurantModule,
    SharedModule
  ],
  controllers: [CatalogController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    CatalogFacade
  ],
  exports: [CatalogFacade]
})
export class CatalogModule {}
