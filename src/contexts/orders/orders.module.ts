import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSchema } from './infrastructure/database/order.schema';
import { OrderItemSchema } from './infrastructure/database/order-item.schema';
import { OrderRepository } from './infrastructure/database/order.repository';
import { ORDER_REPOSITORY_PORT } from './application/ports/order-repository.port';
import { OrderFacade } from './application/order.facade';
import { OrderController } from './presentation/controllers/order.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([OrderSchema, OrderItemSchema])
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: OrderRepository,
    },
    OrderFacade,
  ],
  exports: [
    ORDER_REPOSITORY_PORT,
    OrderFacade,
    TypeOrmModule 
  ]
})
export class OrdersModule {}
