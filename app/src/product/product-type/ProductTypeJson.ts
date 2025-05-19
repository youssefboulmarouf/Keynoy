export class ProductTypeJson {
    private readonly id: number;
    private readonly name: string;
    private readonly isPrintable: boolean;
    private readonly isPaint: boolean;
    private readonly isTool: boolean;

    constructor(
        id: number,
        name: string,
        isPrintable: boolean,
        isPaint: boolean,
        isTool: boolean
    ) {
        this.id = id;
        this.name = name;
        this.isPrintable = isPrintable;
        this.isPaint = isPaint;
        this.isTool = isTool;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getPrintable(): boolean {
        return this.isPrintable;
    }

    public getPaint(): boolean {
        return this.isPaint;
    }

    public getTool(): boolean {
        return this.isTool;
    }

    public static fromObject(body: any): ProductTypeJson {
        return new ProductTypeJson(
            Number(body.id),
            body.name,
            body.isPrintable,
            body.isPaint,
            body.isTool
        )
    }
}