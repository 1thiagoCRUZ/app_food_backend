export interface DeliveryProps {
    id?: number;
    orderId: number;
    courierId: number;
    status: 'FINDING_COURIER' | 'PICKING_UP' | 'IN_TRANSIT' | 'DELIVERED';
}

export class Delivery {
    private id?: number;
    private orderId: number;
    private courierId: number;
    private status: 'FINDING_COURIER' | 'PICKING_UP' | 'IN_TRANSIT' | 'DELIVERED';

    private constructor(props: DeliveryProps) {
        this.id = props.id;
        this.orderId = props.orderId;
        this.courierId = props.courierId;
        this.status = props.status;
    }

    public static create(props: DeliveryProps): Delivery {
        return new Delivery(props);
    }
}
