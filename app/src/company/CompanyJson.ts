import {CompanyTypeEnum, companyTypeFromString, mapCompanyTypeToCompanyTypeEnum} from "./CompanyTypeEnum";
import {CompanyDesignJson} from "./company-design/CompanyDesignJson";

export class CompanyJson {
    private readonly id: number;
    private readonly name: string;
    private readonly companyType: CompanyTypeEnum;
    private readonly phone: string;
    private readonly cityId: number;

    constructor(
        id: number,
        name: string,
        companyType: CompanyTypeEnum,
        phone: string,
        cityId: number
    ) {
        this.id = id;
        this.name = name;
        this.companyType = companyType;
        this.phone = phone;
        this.cityId = cityId;
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

    public getCityId(): number {
        return this.cityId;
    }

    public static fromObject(body: any): CompanyJson {
        return new CompanyJson(
            Number(body.id),
            body.name,
            mapCompanyTypeToCompanyTypeEnum(body.companyType),
            body.phone,
            body.cityId
        )
    }
}