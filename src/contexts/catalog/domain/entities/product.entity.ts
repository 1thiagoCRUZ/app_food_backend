export interface ProductProps {
    id?: number;
    restaurantId: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image?: string;
    category?: string;
    available: boolean;
    stock: number;
}

export class Product {
    private id?: number;
    private restaurantId: number;
    private name: string;
    private description: string;
    private price: number;
    private originalPrice?: number;
    private image?: string;
    private category?: string;
    private available: boolean;
    private stock: number;

    private constructor(props: ProductProps) {
        this.id = props.id;
        this.restaurantId = props.restaurantId;
        this.name = props.name;
        this.description = props.description;
        this.price = props.price;
        this.originalPrice = props.originalPrice;
        this.image = props.image;
        this.category = props.category;
        this.available = props.available !== undefined ? props.available : true;
        this.stock = props.stock !== undefined ? props.stock : 0;
    }

    public static create(props: ProductProps): Product {
        return new Product(props);
    }

    public getId(): number | undefined { return this.id; }
    public getRestaurantId(): number { return this.restaurantId; }
    public getName(): string { return this.name; }
    public getDescription(): string { return this.description; }
    public getPrice(): number { return this.price; }
    public getOriginalPrice(): number | undefined { return this.originalPrice; }
    public getImage(): string | undefined { return this.image; }
    public getCategory(): string | undefined { return this.category; }
    public getAvailable(): boolean { return this.available; }
    public getStock(): number { return this.stock; }
}
