export interface ProductProps {
    id?: number;
    restaurantId: number;
    name: string;
    description: string;
    price: number;
    image?: string | null;
    available?: boolean;
    stock?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Product {
    private id?: number;
    private restaurantId: number;
    private name: string;
    private description: string;
    private price: number;
    private image?: string | null;
    private available: boolean;
    private stock: number;
    private createdAt: Date;
    private updatedAt: Date;

    private constructor(props: ProductProps) {
        this.id = props.id;
        this.restaurantId = props.restaurantId;
        this.name = props.name;
        this.description = props.description;
        this.price = props.price;
        this.image = props.image;
        this.available = props.available !== undefined ? props.available : true;
        this.stock = props.stock !== undefined ? props.stock : 0;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    public static create(props: ProductProps): Product {
        return new Product(props);
    }

    public updateName(name: string): void {
        this.name = name;
        this.updatedAt = new Date();
    }

    public updateDescription(description: string): void {
        this.description = description;
        this.updatedAt = new Date();
    }

    public updatePrice(price: number): void {
        this.price = price;
        this.updatedAt = new Date();
    }

    public updateImage(image: string): void {
        this.image = image;
        this.updatedAt = new Date();
    }

    public updateAvailable(available: boolean): void {
        this.available = available;
        this.updatedAt = new Date();
    }

    public updateStock(stock: number): void {
        this.stock = stock;
        this.updatedAt = new Date();
    }
    public getId(): number | undefined { return this.id; }
    public getRestaurantId(): number { return this.restaurantId; }
    public getName(): string { return this.name; }
    public getDescription(): string { return this.description; }
    public getPrice(): number { return this.price; }
    public getImage(): string | undefined | null { return this.image; }
    public getAvailable(): boolean { return this.available; }
    public getStock(): number { return this.stock; }
    public getCreatedAt(): Date { return this.createdAt; }
    public getUpdatedAt(): Date { return this.updatedAt; }
}
