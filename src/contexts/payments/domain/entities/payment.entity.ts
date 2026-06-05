export interface PaymentProps {
    id?: number;
    orderId: number;
    transactionId: string;
    amount: number;
    method: 'PIX' | 'CREDIT_CARD';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export class Payment {
    private id?: number;
    private orderId: number;
    private transactionId: string;
    private amount: number;
    private method: 'PIX' | 'CREDIT_CARD';
    private status: 'PENDING' | 'APPROVED' | 'REJECTED';

    private constructor(props: PaymentProps) {
        this.id = props.id;
        this.orderId = props.orderId;
        this.transactionId = props.transactionId;
        this.amount = props.amount;
        this.method = props.method;
        this.status = props.status;
    }

    public static create(props: PaymentProps): Payment {
        return new Payment(props);
    }

    public approve(): void {
        this.status = 'APPROVED';
    }

    public reject(): void {
        this.status = 'REJECTED';
    }

    public getId(): number | undefined { return this.id; }
    public getOrderId(): number { return this.orderId; }
    public getTransactionId(): string { return this.transactionId; }
    public getAmount(): number { return this.amount; }
    public getMethod(): 'PIX' | 'CREDIT_CARD' { return this.method; }
    public getStatus(): 'PENDING' | 'APPROVED' | 'REJECTED' { return this.status; }
}
