import {DesignImageJson} from "./design-image/DesignImageJson";

export class CompanyDesignJson {
    private readonly id: number;
    private readonly designName: string;
    private readonly companyId: number;
    private readonly designImages: DesignImageJson[];

    constructor(id: number, designName: string, companyId: number, designImages: DesignImageJson[]) {
        this.id = id;
        this.designName = designName;
        this.companyId = companyId;
        this.designImages = designImages;
    }

    public getId(): number {
        return this.id;
    }

    public getDesignName(): string {
        return this.designName;
    }

    public getCompanyId(): number {
        return this.companyId;
    }

    public getDesignImages(): DesignImageJson[] {
        return this.designImages;
    }

    public static fromRequest(body: any): CompanyDesignJson {
        return new CompanyDesignJson(
            Number(body.id),
            body.designName,
            body.companyId,
            body.designImages.map(DesignImageJson.from),
        )
    }

    public static fromObjectAndDesignImages(companyDesign: any, designImages: DesignImageJson[]): CompanyDesignJson {
        return new CompanyDesignJson(
            Number(companyDesign.id),
            companyDesign.designName,
            companyDesign.companyId,
            designImages,
        )
    }
}