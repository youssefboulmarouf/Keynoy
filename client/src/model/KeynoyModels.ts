export type CompanyJson = {
    id: number;
    name: string;
    type: string;
    phone: string;
    location: string;
}

export type ExpenseJson = {
    id: number;
    name: string;
    totalPrice: number;
    date: Date;
    orderId: number;
}

export type OrderLineJson = {
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
}

export enum OrderStatusEnum {
    CONFIRMED = 1,
    IN_PROGRESS = 2,
    FINISHED = 3,
    SHIPPED = 4,
    DELIVERED = 5,
    RETURNED = 6,
}

export enum OrderTypeEnum {
    BUY = "buy",
    SELL = "sell",
}

export type OrderJson = {
    id: number;
    customerId: number;
    supplierId: number;
    orderType: OrderTypeEnum;
    orderStatus: OrderStatusEnum;
    totalPrice: number;
    date: Date;
    orderLines: OrderLineJson[];
}

export type ProductTypeJson = {
    id: number;
    name: string;
};

export enum ColorEnum {
    TRANSPARENT = "transparent",
    RED = "red",
    BLUE = "blue",
    GREEN = "green",
    YELLOW = "yellow",
    ORANGE = "orange",
    PURPLE = "purple",
    BLACK = "black",
    WHITE = "white",
    GRAY = "gray",
    PINK = "pink",
    BROWN = "brown",
    CYAN = "cyan",
    MAGENTA = "magenta",
    GOLD = "gold",
    UNKNOWN = "unknown",
}

export type ProductJson = {
    id: number;
    name: string;
    size: string;
    productTypeId: number;
    color: ColorEnum;
    threshold: number;
    totalQuantity: number;
}

export type ShippingJson = {
    orderId: number;
    shipperId: number;
    shippingDate: Date;
    deliveryDate: Date | null;
    price: number;
}