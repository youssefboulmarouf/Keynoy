export class DesignImageJson {
    private readonly id: number;
    private readonly imageUrl: string;
    private readonly companyDesignId: number;

    constructor(id: number, imageUrl: string, companyDesignId: number) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.companyDesignId = companyDesignId;
    }

    public getId(): number {
        return this.id;
    }

    public getImageUrl(): string {
        return this.imageUrl;
    }

    public getCompanyDesignId(): number {
        return this.companyDesignId;
    }

    public static from(body: any): DesignImageJson {
        return new DesignImageJson(
            Number(body.id),
            body.imageUrl,
            body.companyDesignId,
        )
    }
}