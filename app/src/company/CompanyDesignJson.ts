export class CompanyDesignJson {
    private readonly id: number;
    private readonly designName: string;
    private readonly designUrl: string;
    private companyId: number;

    constructor(id: number, designName: string, designUrl: string, companyId: number) {
        this.id = id;
        this.designName = designName;
        this.designUrl = designUrl;
        this.companyId = companyId;
    }

    public getId(): number {
        return this.id;
    }

    public setCompanyId(companyId: number): void {
        this.companyId = companyId;
    }

    public getDesignName(): string {
        return this.designName;
    }

    public getDesignUrl(): string {
        return this.designUrl;
    }

    public getCompanyId(): number {
        return this.companyId;
    }

    public static from(body: any): CompanyDesignJson {
        return new CompanyDesignJson(
            Number(body.id),
            body.designName,
            body.designUrl,
            body.companyId,
        )
    }
}