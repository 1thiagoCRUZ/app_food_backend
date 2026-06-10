import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSchema } from './infrastructure/database/order.schema';
import { OrderItemSchema } from './infrastructure/database/order-item.schema';
import { ORDER_REPOSITORY_PORT } from './application/ports/order-repository.port';
import { OrderRepository } from './infrastructure/database/order.repository';
import { OrderController } from './presentation/controllers/order.controller';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { PaymentsModule } from '../payments/payments.module';
import { OrderFacade } from './application/order.facade';

import { SetOrderReadyUseCase } from './application/use-cases/set-order-ready.use-case';
import { ConfirmOrderUseCase } from './application/use-cases/confirm-order.use-case';
import { ApprovePaymentUseCase } from './application/use-cases/approve-payment.use-case';
import { ListAvailableOrdersUseCase } from './application/use-cases/list-available-orders.use-case';
import { ListCourierOrdersUseCase } from './application/use-cases/list-courier-orders.use-case';
import { AcceptOrderUseCase } from './application/use-cases/accept-order.use-case';
import { PickupOrderUseCase } from './application/use-cases/pickup-order.use-case';
import { DeliverOrderUseCase } from './application/use-cases/deliver-order.use-case';

import { GetCourierEarningsUseCase } from './application/use-cases/get-courier-earnings.use-case';

import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { ListUserOrdersUseCase } from './application/use-cases/list-user-orders.use-case';
import { ListRestaurantOrdersUseCase } from './application/use-cases/list-restaurant-orders.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { CancelOrderUseCase } from './application/use-cases/cancel-order.use-case';

import { UserSchema } from '../users/infrastructure/database/user.schema';
import { AdressSchema } from '../users/infrastructure/database/address.schema';
import { CouponSchema } from '../restaurants/infrastructure/database/coupon.schema';
import { ProductSchema } from '../catalog/infrastructure/database/product.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderSchema, OrderItemSchema, UserSchema, AdressSchema, CouponSchema, ProductSchema]),
    RestaurantModule,
    forwardRef(() => DeliveryModule),
    forwardRef(() => PaymentsModule)
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: OrderRepository,
    },
    ConfirmOrderUseCase,
    ApprovePaymentUseCase,
    SetOrderReadyUseCase,
    ListAvailableOrdersUseCase,
    ListCourierOrdersUseCase,
    AcceptOrderUseCase,
    PickupOrderUseCase,
    DeliverOrderUseCase,
    GetCourierEarningsUseCase,
    CreateOrderUseCase,
    ListUserOrdersUseCase,
    ListRestaurantOrdersUseCase,
    GetOrderUseCase,
    CancelOrderUseCase,
    OrderFacade,
  ],
  exports: [
    ORDER_REPOSITORY_PORT,
    OrderFacade,
    TypeOrmModule 
  ]
})
export class OrdersModule {}
