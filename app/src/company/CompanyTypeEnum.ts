import {CompanyType} from ".prisma/client";

export enum CompanyTypeEnum {
    SHIPPER = "Livreur",
    SUPPLIER = "Fournisseur",
    CUSTOMER = "Client",
    UNKNOWN = "UNKNOWN"
}

export function companyTypeFromString(type: string): CompanyTypeEnum {
    const companyType = Object.values(CompanyTypeEnum).find((s) => s === type);
    return companyType ?? CompanyTypeEnum.UNKNOWN;
}

export function mapCompanyTypeEnumToCompanyType(companyType: CompanyTypeEnum): CompanyType {
    switch (companyType) {
        case CompanyTypeEnum.CUSTOMER: return CompanyType.Client;
        case CompanyTypeEnum.SUPPLIER: return CompanyType.Fournisseur;
        case CompanyTypeEnum.SHIPPER: return CompanyType.Livreur;
        default: return CompanyType.Client;
    }
}

export function mapCompanyTypeToCompanyTypeEnum(companyType: CompanyType): CompanyTypeEnum {
    switch (companyType) {
        case CompanyType.Client: return CompanyTypeEnum.CUSTOMER;
        case CompanyType.Fournisseur: return CompanyTypeEnum.SUPPLIER;
        case CompanyType.Livreur: return CompanyTypeEnum.SHIPPER;
        default: return CompanyTypeEnum.CUSTOMER;
    }
}