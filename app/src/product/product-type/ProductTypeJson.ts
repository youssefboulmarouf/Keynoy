export class ProductTypeJson {
    private readonly id: number;
    private readonly name: string;
    private readonly isSellable: boolean;
    private readonly isPaint: boolean;

    constructor(
        id: number,
        name: string,
        isSellable: boolean,
        isPaint: boolean
    ) {
        this.id = id;
        this.name = name;
        this.isSellable = isSellable;
        this.isPaint = isPaint;
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

    public getPaint(): boolean {
        return this.isPaint;
    }

    public static fromObject(body: any): ProductTypeJson {
        return new ProductTypeJson(
            Number(body.id),
            body.name,
            body.isSellable,
            body.isPaint
        )
    }
}