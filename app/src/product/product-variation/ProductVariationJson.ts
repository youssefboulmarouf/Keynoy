export class ProductVariationJson {
    private readonly id: number;
    private readonly productId: number;
    private readonly colorId: number;
    private readonly name: string;
    private readonly size: string;
    private readonly quantity: number;
    private readonly threshold: number;

    constructor(
        id: number,
        productId: number,
        colorId: number,
        name: string,
        size: string,
        quantity: number,
        threshold: number,
    ) {
        this.id = id;
        this.productId = productId;
        this.colorId = colorId;
        this.name = name;
        this.size = size;
        this.quantity = quantity;
        this.threshold = threshold;
    }

    public getId(): number {
        return this.id;
    }

    public getProductId(): number {
        return this.productId;
    }

    public getColorId(): number {
        return this.colorId;
    }

    public getName(): string {
        return this.name;
    }

    public getSize(): string {
        return this.size;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getThreshold(): number {
        return this.threshold;
    }

    public static fromObject(body: any): ProductVariationJson {
        return new ProductVariationJson(
            Number(body.id),
            Number(body.productId),
            body.colorId,
            body.name,
            body.size,
            body.quantity,
            body.threshold,
        )
    }
}