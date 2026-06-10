import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Inject } from '@nestjs/common';
import { UNIT_OF_WORK_PORT, UnitOfWorkPort } from '../../../../shared/application/ports/unit-of-work.port';
import { OrderSchema } from '../../infrastructure/database/order.schema';
import { ProductSchema } from '../../../catalog/infrastructure/database/product.schema';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../../restaurants/application/ports/restaurant-repository.port';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_PORT)
    private readonly uow: UnitOfWorkPort,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
  ) {}

  async execute(id: number, userId: number, role: string) {
    await this.uow.startTransaction();

    try {
      const orderRepository = this.uow.getRepository(OrderSchema);
      const productRepository = this.uow.getRepository(ProductSchema);

      const order = await orderRepository.findOne({
        where: { id },
        relations: ['items'],
        lock: { mode: 'pessimistic_write' }
      });

      if (!order) throw new NotFoundException('Order not found');

      if (role === 'CUSTOMER' && order.userId !== userId) {
        throw new ForbiddenException('Access denied to the order');
      }

      if (role === 'RESTAURANT') {
        const restaurant = await this.restaurantRepository.findById(order.restaurantId);
        if (!restaurant || restaurant.getOwnerId() !== userId) {
          throw new ForbiddenException('Access denied to restaurant order');
        }
      }

      if (['DELIVERED', 'IN_TRANSIT', 'CANCELLED'].includes(order.status)) {
        throw new BadRequestException(`O pedido não pode ser cancelado no status atual: ${order.status}`);
      }

      for (const item of order.items) {
        const product = await productRepository.findOne({ 
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' }
        });
        if (product) {
          product.stock += item.quantity;
          await productRepository.save(product);
        }
      }

      order.status = 'CANCELLED';
      await orderRepository.save(order);
      
      await this.uow.commitTransaction();
      return { message: 'Pedido cancelado com sucesso' };
    } catch (error) {
      await this.uow.rollbackTransaction();
      throw error;
    } finally {
      await this.uow.release();
    }
  }
}
