import AppError from "../utilities/errors/AppError";

export enum OrderTypeEnum {
    BUY = "Achats",
    SELL = "Ventes",
}

export function orderTypeFromString(status: string): OrderTypeEnum {
    if (Object.values(OrderTypeEnum).includes(status as OrderTypeEnum)) {
        return status as OrderTypeEnum;
    }
    throw new AppError("Runtime Error", 500, `Invalid OrderTypeEnum value: ${status}. Expected 'buy' or 'sell'.`);
}