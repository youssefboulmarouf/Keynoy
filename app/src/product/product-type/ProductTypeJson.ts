export class ProductTypeJson {
    private readonly id: number;
    private readonly name: string;
    private readonly sellable: boolean;

    constructor(
        id: number,
        name: string,
        sellable: boolean
    ) {
        this.id = id;
        this.name = name;
        this.sellable = sellable;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public isSellable(): boolean {
        return this.sellable;
    }

    public static from(body: any): ProductTypeJson {
        return new ProductTypeJson(
            Number(body.id),
            body.name,
            body.sellable
        )
    }
}