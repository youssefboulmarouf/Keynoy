export enum OrderTypeEnum {
    BUY = "buy",
    SELL = "sell",
}

export function orderTypeFromString(status: string): OrderTypeEnum | undefined {
    return Object.values(OrderTypeEnum).find((s) => s === status);
}