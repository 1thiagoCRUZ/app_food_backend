export interface CourierProps {
    id?: number;
    userId: number;
    isOnline: boolean;
    currentLat?: number;
    currentLng?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Courier {
    private id?: number;
    private userId: number;
    private isOnline: boolean;
    private currentLat?: number;
    private currentLng?: number;
    private createdAt: Date;
    private updatedAt: Date;

    private constructor(props: CourierProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.isOnline = props.isOnline;
        this.currentLat = props.currentLat;
        this.currentLng = props.currentLng;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    public static create(props: CourierProps): Courier {
        return new Courier(props);
    }

    public getId(): number | undefined { return this.id; }
    public getUserId(): number { return this.userId; }
    public getIsOnline(): boolean { return this.isOnline; }
    public getCurrentLat(): number | undefined { return this.currentLat; }
    public getCurrentLng(): number | undefined { return this.currentLng; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }

    public toggleOnlineStatus(isOnline: boolean): void {
        this.isOnline = isOnline;
        this.updatedAt = new Date();
    }

    public updateLocation(lat: number, lng: number): void {
        this.currentLat = lat;
        this.currentLng = lng;
        this.updatedAt = new Date();
    }
}
