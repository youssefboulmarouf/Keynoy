export enum CompanyTypeEnum {
    SHIPPER = "Livreurs",
    SUPPLIER = "Fournisseurs",
    CUSTOMER = "Clients",
    UNKNOWN = "UNKNOWN"
}

export function companyTypeFromString(type: string): CompanyTypeEnum {
    const color = Object.values(CompanyTypeEnum).find((s) => s === type);
    return color ?? CompanyTypeEnum.UNKNOWN;
}