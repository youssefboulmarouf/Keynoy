import AppError from "../utilities/AppError";

export enum OrderStatusEnum {
    CONFIRMED = 1,
    IN_PROGRESS = 2,
    FINISHED = 3,
    SHIPPED = 4,
    DELIVERED = 5,
    RETURNED = 6,
}

export function orderStatusFromNumber(status: number): OrderStatusEnum {
    if (Object.values(OrderStatusEnum).includes(status)) {
        return status as OrderStatusEnum;
    }
    throw new AppError("Runtime Error", 500, `Invalid OrderStatusEnum value: ${status}`);
}

export function statusToString(orderStatus: OrderStatusEnum): string {
    return OrderStatusEnum[orderStatus];
}