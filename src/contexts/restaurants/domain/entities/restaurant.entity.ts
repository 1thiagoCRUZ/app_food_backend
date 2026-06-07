import { CNPJ } from "../value-objects/cnpj.vo";


export interface RestaurantProps {
    id?: number;
    name: string;
    cnpj: CNPJ;
    isOpen: boolean;
    ownerId?: number;
    photo?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Restaurant {
    private id?: number;
    private name: string;
    private cnpj: CNPJ;
    private isOpen: boolean;
    private ownerId?: number;
    private photo?: string;
    private createdAt: Date;
    private updatedAt: Date;

    private constructor(props: RestaurantProps) {
        this.id = props.id;
        this.name = props.name;
        this.cnpj = props.cnpj;
        this.isOpen = props.isOpen;
        this.ownerId = props.ownerId;
        this.photo = props.photo;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    public static create(props: RestaurantProps): Restaurant {
        return new Restaurant(props);
    }

    public updateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Name cannot be empty');
        }
        this.name = name;
        this.updatedAt = new Date();
    }

    public updateCNPJ(cnpj: CNPJ): void {
        this.cnpj = cnpj;
        this.updatedAt = new Date();
    }

    public updateIsOpen(isOpen: boolean): void {
        this.isOpen = isOpen;
        this.updatedAt = new Date();
    }

    public updatePhoto(photo: string): void {
        this.photo = photo;
        this.updatedAt = new Date();
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCNPJ(): CNPJ {
        return this.cnpj;
    }


    public getIsOpen(): boolean {
        return this.isOpen;
    }

    public getOwnerId(): number | undefined {
        return this.ownerId;
    }

    public getPhoto(): string | undefined {
        return this.photo;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }
}