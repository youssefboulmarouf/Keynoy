export enum OrderStatusEnum {
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in progress",
    FINISHED = "finished",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
}

export function orderStatusFromString(status: string): OrderStatusEnum | undefined {
    return Object.values(OrderStatusEnum).find((s) => s === status);
}