import {ColorEnum, colorFromString} from "./ColorEnum";

export class ProductJson {
    private readonly id: number;
    private readonly name: string;
    private readonly size: string;
    private readonly productTypeId: number;
    private readonly color: ColorEnum;
    private readonly threshold: number;
    private readonly totalQuantity: number;

    constructor(
        id: number,
        name: string,
        size: string,
        productTypeId: number,
        color: string,
        threshold: number,
        totalQuantity: number
    ) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.productTypeId = productTypeId;
        this.color = colorFromString(color);
        this.threshold = threshold;
        this.totalQuantity = totalQuantity;

    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }


    public getSize(): string {
        return this.size;
    }

    public getProductTypeId(): number {
        return this.productTypeId;
    }

    public getColor(): ColorEnum {
        return this.color;
    }

    public getThreshold(): number {
        return this.threshold;
    }

    public getTotalQuantity(): number {
        return this.totalQuantity;
    }

    public static from(body: any): ProductJson {
        return new ProductJson(
            body.id,
            body.name,
            body.size,
            body.productTypeId,
            body.color,
            body.threshold,
            body.totalQuantity
        )
    }
}