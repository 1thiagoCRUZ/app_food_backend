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
    items: OrderItemProps[];
    total: number;
    status: 'PENDING' | 'AWAITING_PAYMENT' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED';
    deliveryVerificationCode?: string;
}

export class Order {
    private id?: number;
    private userId: number;
    private restaurantId: number;
    private items: OrderItemProps[];
    private total: number;
    private status: 'PENDING' | 'AWAITING_PAYMENT' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED';
    private deliveryVerificationCode?: string;

    private constructor(props: OrderProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.restaurantId = props.restaurantId;
        this.items = props.items;
        this.total = props.total;
        this.status = props.status;
        this.deliveryVerificationCode = props.deliveryVerificationCode;
    }

    public static create(props: OrderProps): Order {
        return new Order(props);
    }

    public getId(): number | undefined { return this.id; }
    public getUserId(): number { return this.userId; }
    public getRestaurantId(): number { return this.restaurantId; }
    public getItems(): OrderItemProps[] { return this.items; }
    public getTotal(): number { return this.total; }
    public getStatus(): string { return this.status; }
    public getDeliveryVerificationCode(): string | undefined { return this.deliveryVerificationCode; }

    public approvePayment(): void {
        this.status = 'PREPARING';
    }
}
