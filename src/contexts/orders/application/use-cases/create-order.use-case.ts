import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { In } from 'typeorm';
import { UNIT_OF_WORK_PORT, UnitOfWorkPort } from '../../../../shared/application/ports/unit-of-work.port';
import { OrderSchema } from '../../infrastructure/database/order.schema';
import { OrderItemSchema } from '../../infrastructure/database/order-item.schema';
import { UserSchema } from '../../../users/infrastructure/database/user.schema';
import { AdressSchema } from '../../../users/infrastructure/database/address.schema';
import { CouponSchema } from '../../../restaurants/infrastructure/database/coupon.schema';
import { ProductSchema } from '../../../catalog/infrastructure/database/product.schema';
import { CreateOrderDto } from '../../presentation/dtos/order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_PORT)
    private readonly uow: UnitOfWorkPort,
  ) {}

  async execute(userId: number, dto: CreateOrderDto) {
    // Iniciando a transação via Port puro (sem conhecer o TypeORM diretamente)
    await this.uow.startTransaction();

    try {
      // Usar a transação para todos os repositórios
      const orderRepository = this.uow.getRepository(OrderSchema);
      const userRepository = this.uow.getRepository(UserSchema);
      const addressRepository = this.uow.getRepository(AdressSchema);
      const couponRepository = this.uow.getRepository(CouponSchema);
      const productRepository = this.uow.getRepository(ProductSchema);

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const address = await addressRepository.findOne({ where: { id: dto.deliveryAddressId, userId } });
      if (!address) throw new NotFoundException('Delivery address not found');

      // Resolve N+1: Buscar todos os produtos em uma única query
      const productIds = dto.items.map(i => i.productId);
      const products = await productRepository.find({
        where: { id: In(productIds) },
        // Travar a linha para evitar condição de corrida em concorrência alta (Pessimistic Write)
        lock: { mode: 'pessimistic_write' }
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('Um ou mais produtos não foram encontrados no banco de dados');
      }

      let total = 0;
      const items: OrderItemSchema[] = [];

      for (const itemDto of dto.items) {
        const product = products.find(p => p.id === itemDto.productId)!;

        if (product.restaurantId !== dto.restaurantId) {
          throw new BadRequestException(`Product ID ${product.id} does not belong to this restaurant`);
        }
        if (!product.available) {
          throw new BadRequestException(`Product ${product.name} is currently unavailable`);
        }
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}. Available: ${product.stock}`);
        }

        // Abate o estoque em memória (será salvo depois no bulk)
        product.stock -= itemDto.quantity;

        total += Number(product.price) * itemDto.quantity;

        const orderItem = new OrderItemSchema();
        orderItem.productId = itemDto.productId;
        orderItem.name = product.name;
        orderItem.price = product.price;
        orderItem.quantity = itemDto.quantity;
        items.push(orderItem);
      }

      // Salva a alteração de estoque de todos os produtos de uma vez dentro da transação
      await productRepository.save(products);

      let subtotal = total;
      let discount = 0;

      if (dto.couponCode) {
        const coupon = await couponRepository.findOne({ 
          where: { code: dto.couponCode.toUpperCase(), restaurantId: dto.restaurantId },
          lock: { mode: 'pessimistic_write' }
        });

        if (!coupon) throw new BadRequestException('Invalid coupon or does not belong to this restaurant');
        if (!coupon.isActive) throw new BadRequestException('This coupon is no longer active');
        if (new Date() > new Date(coupon.expiresAt)) throw new BadRequestException('This coupon has expired');
        if (coupon.limit > 0 && coupon.uses >= coupon.limit) throw new BadRequestException('This coupon has reached its usage limit');
        if (subtotal < coupon.min) throw new BadRequestException(`The minimum amount to use this coupon is R$ ${coupon.min}`);

        if (coupon.type === 'percent') {
          discount = (subtotal * Number(coupon.value)) / 100;
        } else if (coupon.type === 'fixed') {
          discount = Number(coupon.value);
        }
        
        if (discount > subtotal) discount = subtotal;
        total = subtotal - discount;

        coupon.uses += 1;
        await couponRepository.save(coupon);
      }

      const order = orderRepository.create({
        userId,
        customerName: user.name,
        customerPhone: user.phone || undefined,
        restaurantId: dto.restaurantId,
        deliveryAddressId: dto.deliveryAddressId,
        deliveryStreet: address.street,
        deliveryCity: address.city,
        deliveryState: address.state,
        deliveryZipCode: address.zipCode,
        paymentMethod: dto.paymentMethod,
        subtotal,
        discount: discount > 0 ? discount : undefined,
        couponCode: dto.couponCode ? dto.couponCode.toUpperCase() : undefined,
        total,
        courierFee: total * 0.20,
        items,
        deliveryVerificationCode: Math.floor(1000 + Math.random() * 9000).toString(),
        pickupVerificationCode: Math.floor(1000 + Math.random() * 9000).toString(),
      });
      
      const savedOrder = await orderRepository.save(order);

      // Comita a transação se tudo der certo
      await this.uow.commitTransaction();
      return savedOrder;

    } catch (error) {
      // Se algo falhar (ex: falta de estoque de um produto no meio do processamento), rollback total
      await this.uow.rollbackTransaction();
      throw error;
    } finally {
      await this.uow.release();
    }
  }
}
