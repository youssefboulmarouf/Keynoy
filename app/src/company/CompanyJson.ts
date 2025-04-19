import {companyTypeFromString} from "./CompanyTypeEnum";
import {CompanyDesignJson} from "./CompanyDesignJson";

export class CompanyJson {
    private readonly id: number;
    private readonly name: string;
    private readonly type: string;
    private readonly phone: string;
    private readonly location: string;
    private readonly designUrls: CompanyDesignJson[];

    constructor(
        id: number,
        name: string,
        type: string,
        phone: string,
        location: string,
        designUrls: CompanyDesignJson[],
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.phone = phone;
        this.location = location;
        this.designUrls = designUrls;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }

    public getPhone(): string {
        return this.phone;
    }

    public getLocation(): string {
        return this.location;
    }

    public getDesignUrls(): CompanyDesignJson[] {
        return this.designUrls;
    }

    public static fromObject(body: any): CompanyJson {
        return new CompanyJson(
            Number(body.id),
            body.name,
            companyTypeFromString(body.type),
            body.phone,
            body.location,
            body.designUrls.map((d: any) => CompanyDesignJson.from(d)),
        )
    }

    public static fromObjectAndDesigns(body: any, designs: CompanyDesignJson[]): CompanyJson {
        return new CompanyJson(
            Number(body.id),
            body.name,
            companyTypeFromString(body.type),
            body.phone,
            body.location,
            designs,
        )
    }
}