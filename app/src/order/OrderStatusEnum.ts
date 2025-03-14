export enum OrderStatusEnum {
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in progress",
    FINISHED = "finished",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    RETURNED = "returned",
    UNKNOWN = "unknown",
}

export function orderStatusFromString(status: string): OrderStatusEnum {
    const orderStatus = Object.values(OrderStatusEnum).find((s) => s === status);
    return orderStatus ?? OrderStatusEnum.UNKNOWN;
}