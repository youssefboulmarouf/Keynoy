import {CompanyTypeEnum, companyTypeFromString, mapCompanyTypeToCompanyTypeEnum} from "./CompanyTypeEnum";
import {CompanyDesignJson} from "./company-design/CompanyDesignJson";

export class CompanyJson {
    private readonly id: number;
    private readonly name: string;
    private readonly companyType: CompanyTypeEnum;
    private readonly phone: string;
    private readonly location: string;
    private readonly companyDesigns: CompanyDesignJson[];

    constructor(
        id: number,
        name: string,
        companyType: CompanyTypeEnum,
        phone: string,
        location: string,
        companyDesigns: CompanyDesignJson[],
    ) {
        this.id = id;
        this.name = name;
        this.companyType = companyType;
        this.phone = phone;
        this.location = location;
        this.companyDesigns = companyDesigns;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCompanyType(): CompanyTypeEnum {
        return this.companyType;
    }

    public getPhone(): string {
        return this.phone;
    }

    public getLocation(): string {
        return this.location;
    }

    public static fromObject(body: any): CompanyJson {
        return new CompanyJson(
            Number(body.id),
            body.name,
            mapCompanyTypeToCompanyTypeEnum(body.companyType),
            body.phone,
            body.location,
            designs,
        )
    }
}