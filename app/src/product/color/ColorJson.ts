export class ColorJson {
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

    public static from(body: any): ColorJson {
        return new ColorJson(
            body.id,
            body.name
        )
    }
}