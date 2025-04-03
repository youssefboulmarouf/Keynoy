import AppError from "../utilities/errors/AppError";

export enum OrderTypeEnum {
    BUY = "buy",
    SELL = "sell",
}

export function orderTypeFromString(status: string): OrderTypeEnum {
    if (Object.values(OrderTypeEnum).includes(status as OrderTypeEnum)) {
        return status as OrderTypeEnum;
    }
    throw new AppError("Runtime Error", 500, `Invalid OrderTypeEnum value: ${status}. Expected 'buy' or 'sell'.`);
}