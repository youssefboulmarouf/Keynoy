export class ProductTypeJson {
    private readonly id: number;
    private readonly name: string;

    constructor(
        id: number,
        name: string
    ) {
        this.id = id;
        this.name = name;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public static fromObject(body: any): ProductTypeJson {
        return new ProductTypeJson(
            Number(body.id),
            body.name
        )
    }
}