import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderSchema } from '../infrastructure/database/order.schema';
import { OrderItemSchema } from '../infrastructure/database/order-item.schema';
import { UserSchema } from '../../users/infrastructure/database/user.schema';
import { AdressSchema } from '../../users/infrastructure/database/address.schema';
import { CouponSchema } from '../../restaurants/infrastructure/database/coupon.schema';
import { ProductSchema } from '../../catalog/infrastructure/database/product.schema';
import { CreateOrderDto } from '../presentation/dtos/order.dto';
import { RESTAURANT_REPOSITORY_PORT, type RestaurantRepositoryPort } from '../../restaurants/application/ports/restaurant-repository.port';

import { SetOrderReadyUseCase } from './use-cases/set-order-ready.use-case';
import { ConfirmOrderUseCase } from './use-cases/confirm-order.use-case';
import { ApprovePaymentUseCase } from './use-cases/approve-payment.use-case';
import { ListAvailableOrdersUseCase } from './use-cases/list-available-orders.use-case';
import { ListCourierOrdersUseCase } from './use-cases/list-courier-orders.use-case';
import { AcceptOrderUseCase } from './use-cases/accept-order.use-case';
import { PickupOrderUseCase } from './use-cases/pickup-order.use-case';
import { DeliverOrderUseCase } from './use-cases/deliver-order.use-case';

@Injectable()
export class OrderFacade {
  constructor(
    @InjectRepository(OrderSchema)
    private readonly orderRepository: Repository<OrderSchema>,
    @Inject(RESTAURANT_REPOSITORY_PORT)
    private readonly restaurantRepository: RestaurantRepositoryPort,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
    @InjectRepository(AdressSchema)
    private readonly addressRepository: Repository<AdressSchema>,
    @InjectRepository(CouponSchema)
    private readonly couponRepository: Repository<CouponSchema>,
    @InjectRepository(ProductSchema)
    private readonly productRepository: Repository<ProductSchema>,

    private readonly setOrderReadyUseCase: SetOrderReadyUseCase,
    private readonly confirmOrderUseCase: ConfirmOrderUseCase,
    private readonly approvePaymentUseCase: ApprovePaymentUseCase,
    private readonly listAvailableOrdersUseCase: ListAvailableOrdersUseCase,
    private readonly listCourierOrdersUseCase: ListCourierOrdersUseCase,
    private readonly acceptOrderUseCase: AcceptOrderUseCase,
    private readonly pickupOrderUseCase: PickupOrderUseCase,
    private readonly deliverOrderUseCase: DeliverOrderUseCase,
  ) {}

  async setReady(id: number, userId: number, role: string) {
    return this.setOrderReadyUseCase.execute(id, userId, role);
  }

  async confirm(id: number, userId: number, role: string) {
    return this.confirmOrderUseCase.execute(id, userId, role);
  }

  async pay(id: number, userId: number, role: string) {
    return this.approvePaymentUseCase.execute(id, userId, role);
  }

  async listAvailable(role: string) {
    return this.listAvailableOrdersUseCase.execute(role);
  }

  async listCourierOrders(userId: number, role: string) {
    return this.listCourierOrdersUseCase.execute(userId, role);
  }

  async countCourierDeliveries(courierId: number): Promise<number> {
    return this.orderRepository.countDeliveries(courierId);
  }

  async accept(id: number, userId: number, role: string) {
    return this.acceptOrderUseCase.execute(id, userId, role);
  }

  async pickup(id: number, userId: number, role: string, code: string) {
    return this.pickupOrderUseCase.execute(id, userId, role, code);
  }

  async deliver(id: number, userId: number, role: string, code: string) {
    return this.deliverOrderUseCase.execute(id, userId, role, code);
  }

  async create(userId: number, dto: CreateOrderDto) {
    let total = 0;
    const items: OrderItemSchema[] = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Produto ID ${item.productId} não encontrado`);
      if (product.restaurantId !== dto.restaurantId) throw new BadRequestException(`Produto ID ${item.productId} não pertence a este restaurante`);
      if (!product.available) throw new BadRequestException(`Produto ${product.name} não está disponível no momento`);
      if (product.stock < item.quantity) throw new BadRequestException(`Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}`);

      // Deduct stock
      product.stock -= item.quantity;
      await this.productRepository.save(product);

      // Force price from DB
      total += Number(product.price) * item.quantity;
      
      const orderItem = new OrderItemSchema();
      orderItem.productId = item.productId;
      orderItem.name = product.name; // Get name from DB
      orderItem.price = product.price; // Get price from DB
      orderItem.quantity = item.quantity;
      items.push(orderItem);
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const address = await this.addressRepository.findOne({ where: { id: dto.deliveryAddressId, userId } });
    if (!address) throw new NotFoundException('Endereço de entrega não encontrado');

    let subtotal = total;
    let discount = 0;

    if (dto.couponCode) {
      const coupon = await this.couponRepository.findOne({ 
        where: { code: dto.couponCode.toUpperCase(), restaurantId: dto.restaurantId } 
      });

      if (!coupon) throw new BadRequestException('Cupom inválido ou não pertence a este restaurante');
      if (!coupon.isActive) throw new BadRequestException('Este cupom não está mais ativo');
      if (new Date() > new Date(coupon.expiresAt)) throw new BadRequestException('Este cupom expirou');
      if (coupon.limit > 0 && coupon.uses >= coupon.limit) throw new BadRequestException('Este cupom já atingiu o limite de usos');
      if (subtotal < coupon.min) throw new BadRequestException(`O valor mínimo para usar este cupom é R$ ${coupon.min}`);

      if (coupon.type === 'percent') {
        discount = (subtotal * Number(coupon.value)) / 100;
      } else if (coupon.type === 'fixed') {
        discount = Number(coupon.value);
      }
      
      // Prevent discount from being greater than subtotal
      if (discount > subtotal) discount = subtotal;
      
      total = subtotal - discount;

      // Increment coupon uses
      coupon.uses += 1;
      await this.couponRepository.save(coupon);
    }

    const order = this.orderRepository.create({
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
    return this.orderRepository.save(order);
  }
  async listByUser(userId: number) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
  async listByRestaurant(restaurantId: number, userId: number) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant || restaurant.getOwnerId() !== userId) {
      throw new ForbiddenException('Acesso negado aos pedidos do restaurante');
    }
    return this.orderRepository.find({
      where: { restaurantId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
  async getOne(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (order.userId !== userId) {
      const restaurant = await this.restaurantRepository.findById(order.restaurantId);
      if (!restaurant || restaurant.getOwnerId() !== userId) {
        throw new ForbiddenException('Acesso negado ao pedido');
      }
    }
    return order;
  }

  async cancel(id: number, userId: number, role: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Pedido não encontrado');

    if (role === 'CUSTOMER' && order.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para cancelar este pedido');
    }

    if (role === 'RESTAURANT') {
      const restaurant = await this.restaurantRepository.findById(order.restaurantId);
      if (!restaurant || restaurant.getOwnerId() !== userId) {
        throw new ForbiddenException('Acesso negado ao pedido do restaurante');
      }
    }

    if (['DELIVERED', 'IN_TRANSIT', 'CANCELLED'].includes(order.status)) {
      throw new BadRequestException(`O pedido não pode ser cancelado no status atual: ${order.status}`);
    }

    // Increment stock back
    for (const item of order.items) {
      const product = await this.productRepository.findOne({ where: { id: item.productId } });
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }

    order.status = 'CANCELLED';
    await this.orderRepository.save(order);
    return { message: 'Pedido cancelado com sucesso' };
  }
}
