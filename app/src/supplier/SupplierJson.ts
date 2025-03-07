export class SupplierJson {
    private readonly id: number;
    private readonly name: string;

    constructor(
        id: number,
        name: string,
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

    public static from(body: any): SupplierJson {
        return new SupplierJson(
            body.id,
            body.name
        )
    }
}