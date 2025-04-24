import {ColorJson} from "../../color/ColorJson";

export class ProductVariationJson {
    private readonly id: number;
    private readonly productId: number;
    private readonly color: ColorJson;
    private readonly name: string;
    private readonly size: string;
    private readonly quantity: number;
    private readonly threshold: number;

    constructor(
        id: number,
        productId: number,
        color: ColorJson,
        name: string,
        size: string,
        quantity: number,
        threshold: number,
    ) {
        this.id = id;
        this.productId = productId;
        this.color = color;
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

    public getColor(): ColorJson {
        return this.color;
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

    public static fromRequest(body: any): ProductVariationJson {
        return new ProductVariationJson(
            Number(body.id),
            Number(body.productId),
            ColorJson.from(body.color),
            body.name,
            body.size,
            body.quantity,
            body.threshold,
        )
    }

    public static fromObjectAndColor(body: any, color: ColorJson): ProductVariationJson {
        return new ProductVariationJson(
            Number(body.id),
            Number(body.productId),
            color,
            body.name,
            body.size,
            body.quantity,
            body.threshold,
        )
    }
}