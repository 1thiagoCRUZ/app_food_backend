export interface OrderItemProps {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderProps {
    id?: number;
    userId: number;
    customerName?: string;
    customerPhone?: string;
    restaurantId: number;
    courierId?: number;
    courierFee?: number;
    deliveryStreet?: string;
    deliveryCity?: string;
    deliveryState?: string;
    deliveryZipCode?: string;
    paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'VR';
    items: OrderItemProps[];
    subtotal: number;
    discount?: number;
    couponCode?: string;
    total: number;
    status: 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'PREPARING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    deliveryVerificationCode?: string;
    pickupVerificationCode?: string;
    createdAt?: Date;
}

export class Order {
    private id?: number;
    private userId: number;
    private customerName?: string;
    private customerPhone?: string;
    private restaurantId: number;
    private courierId?: number;
    private courierFee?: number;
    private deliveryStreet?: string;
    private deliveryCity?: string;
    private deliveryState?: string;
    private deliveryZipCode?: string;
    private paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'VR';
    private items: OrderItemProps[];
    private subtotal: number;
    private discount?: number;
    private couponCode?: string;
    private total: number;
    private status: 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'PREPARING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    private deliveryVerificationCode?: string;
    private pickupVerificationCode?: string;
    private createdAt?: Date;

    private constructor(props: OrderProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.customerName = props.customerName;
        this.customerPhone = props.customerPhone;
        this.restaurantId = props.restaurantId;
        this.courierId = props.courierId;
        this.courierFee = props.courierFee;
        this.deliveryStreet = props.deliveryStreet;
        this.deliveryCity = props.deliveryCity;
        this.deliveryState = props.deliveryState;
        this.deliveryZipCode = props.deliveryZipCode;
        this.paymentMethod = props.paymentMethod;
        this.items = props.items;
        this.subtotal = props.subtotal;
        this.discount = props.discount;
        this.couponCode = props.couponCode;
        this.total = props.total;
        this.status = props.status;
        this.deliveryVerificationCode = props.deliveryVerificationCode;
        this.pickupVerificationCode = props.pickupVerificationCode;
        this.createdAt = props.createdAt;
    }

    public static create(props: OrderProps): Order {
        return new Order(props);
    }

    public getId(): number | undefined { return this.id; }
    public getUserId(): number { return this.userId; }
    public getCustomerName(): string | undefined { return this.customerName; }
    public getCustomerPhone(): string | undefined { return this.customerPhone; }
    public getRestaurantId(): number { return this.restaurantId; }
    public getCourierId(): number | undefined { return this.courierId; }
    public getCourierFee(): number | undefined { return this.courierFee; }
    public getDeliveryStreet(): string | undefined { return this.deliveryStreet; }
    public getDeliveryCity(): string | undefined { return this.deliveryCity; }
    public getDeliveryState(): string | undefined { return this.deliveryState; }
    public getDeliveryZipCode(): string | undefined { return this.deliveryZipCode; }
    public getPaymentMethod(): string | undefined { return this.paymentMethod; }
    public getItems(): OrderItemProps[] { return this.items; }
    public getSubtotal(): number { return this.subtotal; }
    public getDiscount(): number | undefined { return this.discount; }
    public getCouponCode(): string | undefined { return this.couponCode; }
    public getTotal(): number { return this.total; }
    public getStatus(): string { return this.status; }
    public getDeliveryVerificationCode(): string | undefined { return this.deliveryVerificationCode; }
    public getPickupVerificationCode(): string | undefined { return this.pickupVerificationCode; }
    public getCreatedAt(): Date | undefined { return this.createdAt; }

    public approvePayment(): void {
        this.status = 'PAID';
    }

    public confirm(): void {
        if (this.status !== 'PAID' && this.status !== 'PENDING') {
            throw new Error('O pedido não está aguardando confirmação do restaurante');
        }
        this.status = 'PREPARING';
    }

    public setReadyForPickup(): void {
        if (this.status !== 'PREPARING') throw new Error('Pedido não está sendo preparado');
        this.status = 'READY_FOR_PICKUP';
    }

    public assignCourier(courierId: number): void {
        if (this.status !== 'READY_FOR_PICKUP') throw new Error('Pedido não está pronto para entrega');
        this.courierId = courierId;
    }

    public pickup(code: string): void {
        if (this.status !== 'READY_FOR_PICKUP') throw new Error('Pedido não está aguardando retirada');
        if (this.pickupVerificationCode !== code) throw new Error('Código de retirada inválido');
        this.status = 'IN_TRANSIT';
    }

    public deliver(code: string): void {
        if (this.status !== 'IN_TRANSIT') throw new Error('Pedido não está em trânsito');
        if (this.deliveryVerificationCode !== code) throw new Error('Código de entrega inválido');
        this.status = 'DELIVERED';
    }
}
