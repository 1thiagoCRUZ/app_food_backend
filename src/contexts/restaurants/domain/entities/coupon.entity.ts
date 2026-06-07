export interface CouponProps {
    id?: number;
    restaurantId: number;
    code: string;
    type: 'percent' | 'fixed' | 'shipping';
    value: string;
    min: number;
    uses: number;
    limit: number;
    isActive: boolean;
    expiresAt: Date;
    createdAt?: Date;
}

export class Coupon {
    private id?: number;
    private restaurantId: number;
    private code: string;
    private type: 'percent' | 'fixed' | 'shipping';
    private value: string;
    private min: number;
    private uses: number;
    private limit: number;
    private isActive: boolean;
    private expiresAt: Date;
    private createdAt: Date;

    private constructor(props: CouponProps) {
        this.id = props.id;
        this.restaurantId = props.restaurantId;
        this.code = props.code.toUpperCase();
        this.type = props.type;
        this.value = props.value;
        this.min = props.min;
        this.uses = props.uses || 0;
        this.limit = props.limit;
        this.isActive = props.isActive;
        this.expiresAt = props.expiresAt;
        this.createdAt = props.createdAt || new Date();
    }

    public static create(props: CouponProps): Coupon {
        return new Coupon(props);
    }

    public getId(): number | undefined { return this.id; }
    public getRestaurantId(): number { return this.restaurantId; }
    public getCode(): string { return this.code; }
    public getType(): string { return this.type; }
    public getValue(): string { return this.value; }
    public getMin(): number { return this.min; }
    public getUses(): number { return this.uses; }
    public getLimit(): number { return this.limit; }
    public getIsActive(): boolean { return this.isActive; }
    public getExpiresAt(): Date { return this.expiresAt; }
    public getCreatedAt(): Date { return this.createdAt; }

    public deactivate(): void {
        this.isActive = false;
    }

    public updateCode(code: string): void { this.code = code.toUpperCase(); }
    public updateType(type: 'percent' | 'fixed' | 'shipping'): void { this.type = type; }
    public updateValue(value: string): void { this.value = value; }
    public updateMin(min: number): void { this.min = min; }
    public updateLimit(limit: number): void { this.limit = limit; }
    public updateIsActive(isActive: boolean): void { this.isActive = isActive; }
    public updateExpiresAt(expiresAt: Date): void { this.expiresAt = expiresAt; }

    public isValid(): boolean {
        return this.isActive && new Date() <= this.expiresAt;
    }
}
