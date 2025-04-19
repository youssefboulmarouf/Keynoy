import {ColorJson} from "../color/ColorJson";

export class ProductJson {
    private readonly id: number;
    private readonly name: string;
    private readonly size: string;
    private readonly productTypeId: number;
    private readonly colors: ColorJson[];
    private readonly threshold: number;
    private readonly totalQuantity: number;

    constructor(
        id: number,
        name: string,
        size: string,
        productTypeId: number,
        colors: ColorJson[],
        threshold: number,
        totalQuantity: number
    ) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.productTypeId = productTypeId;
        this.colors = colors;
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

    public getColors(): ColorJson[] {
        return this.colors;
    }

    public getThreshold(): number {
        return this.threshold;
    }

    public getTotalQuantity(): number {
        return this.totalQuantity;
    }

    public static fromObject(body: any): ProductJson {
        return new ProductJson(
            Number(body.id),
            body.name,
            body.size,
            Number(body.productTypeId),
            body.colors.map(ColorJson.from),
            Number(body.threshold),
            Number(body.totalQuantity)
        )
    }

    public static fromObjectAndColor(body: any, colors: ColorJson[]): ProductJson {
        return new ProductJson(
            Number(body.id),
            body.name,
            body.size,
            Number(body.productTypeId),
            colors,
            Number(body.threshold),
            Number(body.totalQuantity)
        )
    }
}