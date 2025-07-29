export class ProductJson {
    private readonly id: number;
    private readonly name: string;
    private readonly isSellable: boolean;
    private readonly isLayer: boolean;
    private readonly isPaint: boolean;
    private readonly isPrintable: boolean;
    private readonly isPaintTool: boolean;
    private readonly isPrintTool: boolean;
    private readonly productTypeId: number;

    constructor(
        id: number,
        name: string,
        isSellable: boolean,
        isLayer: boolean,
        isPaint: boolean,
        isPrintable: boolean,
        isPaintTool: boolean,
        isPrintTool: boolean,
        productTypeId: number,
    ) {
        this.id = id;
        this.name = name;
        this.isSellable = isSellable;
        this.isLayer = isLayer;
        this.isPaint = isPaint;
        this.isPrintable = isPrintable;
        this.isPaintTool = isPaintTool;
        this.isPrintTool = isPrintTool;
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

    public getPaint(): boolean {
        return this.isPaint;
    }

    public getPrintable(): boolean {
        return this.isPrintable;
    }

    public getPaintTool(): boolean {
        return this.isPaintTool;
    }

    public getPrintTool(): boolean {
        return this.isPrintTool;
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
            body.isPaint,
            body.isPrintable,
            body.isPaintTool,
            body.isPrintTool,
            Number(body.productTypeId)
        )
    }
}