import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSchema } from './infrastructure/database/product.schema';
import { CatalogFacade } from './application/catalog.facade';
import { CatalogController } from './presentation/controllers/catalog.controller';

import { RestaurantModule } from '../restaurants/restaurant.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductSchema]),
    RestaurantModule,
    SharedModule
  ],
  controllers: [CatalogController],
  providers: [CatalogFacade],
  exports: [CatalogFacade]
})
export class CatalogModule {}
