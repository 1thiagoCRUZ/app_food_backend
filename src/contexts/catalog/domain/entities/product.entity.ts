export interface ProductProps {
    id?: number;
    restaurantId: number;
    name: string;
    description: string;
    price: number;
}

export class Product {
    private id?: number;
    private restaurantId: number;
    private name: string;
    private description: string;
    private price: number;

    private constructor(props: ProductProps) {
        this.id = props.id;
        this.restaurantId = props.restaurantId;
        this.name = props.name;
        this.description = props.description;
        this.price = props.price;
    }

    public static create(props: ProductProps): Product {
        return new Product(props);
    }

    public getId(): number | undefined { return this.id; }
    public getRestaurantId(): number { return this.restaurantId; }
    public getName(): string { return this.name; }
    public getDescription(): string { return this.description; }
    public getPrice(): number { return this.price; }
}
