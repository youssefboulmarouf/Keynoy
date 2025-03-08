export enum OrderTypeEnum {
    BUY = "buy",
    SELL = "sell",
    UNKNOWN = "unknown",
}

export function orderTypeFromString(status: string): OrderTypeEnum {
    const orderType = Object.values(OrderTypeEnum).find((s) => s === status);
    return orderType ?? OrderTypeEnum.UNKNOWN;
}