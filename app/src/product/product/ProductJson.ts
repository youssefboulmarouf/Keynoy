export class ProductJson {
    private readonly id: number;
    private readonly name: string;
    private readonly isSellable: boolean;
    private readonly isLayer: boolean;
    private readonly productTypeId: number;

    constructor(
        id: number,
        name: string,
        isSellable: boolean,
        isLayer: boolean,
        productTypeId: number,
    ) {
        this.id = id;
        this.name = name;
        this.isSellable = isSellable;
        this.isLayer = isLayer;
        this.productTypeId = productTypeId;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getSellable(): boolean {
        return this.isSellable;
    }

    public getLayer(): boolean {
        return this.isLayer;
    }

    public getProductTypeId(): number {
        return this.productTypeId;
    }

    public static fromObject(body: any): ProductJson {
        return new ProductJson(
            Number(body.id),
            body.name,
            body.isSellable,
            body.isLayer,
            Number(body.productTypeId)
        )
    }
}