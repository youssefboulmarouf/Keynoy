export class ColorJson {
    private readonly id: number;
    private readonly name: string;
    private readonly htmlCode: string;

    constructor(
        id: number,
        name: string,
        htmlCode: string
    ) {
        this.id = id;
        this.name = name;
        this.htmlCode = htmlCode;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getHtmlCode(): string {
        return this.htmlCode;
    }

    public static from(body: any): ColorJson {
        return new ColorJson(
            Number(body.id),
            body.name,
            body.htmlCode
        )
    }
}