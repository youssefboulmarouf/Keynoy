export class ProductJson {
    private readonly id: number;
    private readonly name: string;
    private readonly productTypeId: number;

    constructor(
        id: number,
        name: string,
        productTypeId: number,
    ) {
        this.id = id;
        this.name = name;
        this.productTypeId = productTypeId;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getProductTypeId(): number {
        return this.productTypeId;
    }

    public static fromObject(body: any): ProductJson {
        return new ProductJson(
            Number(body.id),
            body.name,
            Number(body.productTypeId)
        )
    }
}