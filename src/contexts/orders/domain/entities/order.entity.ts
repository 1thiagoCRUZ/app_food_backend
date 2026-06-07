export interface OrderItemProps {
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderProps {
    id?: number;
    userId: number;
    restaurantId: number;
    courierId?: number;
    courierFee?: number;
    items: OrderItemProps[];
    total: number;
    status: 'PENDING' | 'AWAITING_PAYMENT' | 'PREPARING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED';
    deliveryVerificationCode?: string;
    pickupVerificationCode?: string;
}

export class Order {
    private id?: number;
    private userId: number;
    private restaurantId: number;
    private courierId?: number;
    private courierFee?: number;
    private items: OrderItemProps[];
    private total: number;
    private status: 'PENDING' | 'AWAITING_PAYMENT' | 'PREPARING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED';
    private deliveryVerificationCode?: string;
    private pickupVerificationCode?: string;

    private constructor(props: OrderProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.restaurantId = props.restaurantId;
        this.courierId = props.courierId;
        this.courierFee = props.courierFee;
        this.items = props.items;
        this.total = props.total;
        this.status = props.status;
        this.deliveryVerificationCode = props.deliveryVerificationCode;
        this.pickupVerificationCode = props.pickupVerificationCode;
    }

    public static create(props: OrderProps): Order {
        return new Order(props);
    }

    public getId(): number | undefined { return this.id; }
    public getUserId(): number { return this.userId; }
    public getRestaurantId(): number { return this.restaurantId; }
    public getCourierId(): number | undefined { return this.courierId; }
    public getCourierFee(): number | undefined { return this.courierFee; }
    public getItems(): OrderItemProps[] { return this.items; }
    public getTotal(): number { return this.total; }
    public getStatus(): string { return this.status; }
    public getDeliveryVerificationCode(): string | undefined { return this.deliveryVerificationCode; }
    public getPickupVerificationCode(): string | undefined { return this.pickupVerificationCode; }

    public approvePayment(): void {
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
