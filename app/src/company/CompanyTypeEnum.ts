export enum CompanyTypeEnum {
    SHIPPER = "SHIPPER",
    SUPPLIER = "SUPPLIER",
    CUSTOMER = "CUSTOMER",
    UNKNOWN = "UNKNOWN"
}

export function companyTypeFromString(type: string): CompanyTypeEnum {
    const color = Object.values(CompanyTypeEnum).find((s) => s === type);
    return color ?? CompanyTypeEnum.UNKNOWN;
}