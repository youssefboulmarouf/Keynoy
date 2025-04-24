import {ProductVariationJson} from "./product-variation/ProductVariationJson";

export class ProductJson {
    private readonly id: number;
    private readonly name: string;
    private readonly productTypeId: number;
    private readonly productVariations: ProductVariationJson[];

    constructor(
        id: number,
        name: string,
        productTypeId: number,
        productVariations: ProductVariationJson[]
    ) {
        this.id = id;
        this.name = name;
        this.productTypeId = productTypeId;
        this.productVariations = productVariations;
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

    public getProductVariations(): ProductVariationJson[] {
        return this.productVariations;
    }

    public static fromObject(body: any): ProductJson {
        return new ProductJson(
            Number(body.id),
            body.name,
            Number(body.productTypeId),
            body.productVariations.map(ProductVariationJson.fromRequest)
        )
    }

    public static fromObjectAndVariation(body: any, productVariations: ProductVariationJson[]): ProductJson {
        return new ProductJson(
            Number(body.id),
            body.name,
            Number(body.productTypeId),
            productVariations
        )
    }
}