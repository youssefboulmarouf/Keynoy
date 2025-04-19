export type CompanyJson = {
    id: number;
    name: string;
    type: string;
    phone: string;
    location: string;
    designUrls: CompanyDesignJson[];
}

export type CompanyDesignJson = {
    id: number;
    designName: string;
    designUrl: string;
    companyId: number;
}

export enum CompanyTypeEnum {
    SHIPPERS =  "Livreurs",
    SUPPLIERS = "Fournisseurs",
    CUSTOMERS = "Clients",
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
    BUY = "Achats",
    SELL = "Ventes",
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
    sellable: boolean;
};

export type ColorJson = {
    id: number;
    name: string;
    htmlCode: string;
}

export enum ColorEnum {
    TRANSPARENT = "transparent",
    RED = "red",
    BLUE = "blue",
    GREEN = "green",
    YELLOW = "yellow",
    GOLD = "gold",
    ORANGE = "orange",
    PURPLE = "purple",
    BLACK = "black",
    WHITE = "white",
    GRAY = "gray",
    PINK = "pink",
    BROWN = "brown",
    CYAN = "cyan",
    MAGENTA = "magenta",
    UNKNOWN = "unknown",
}

export type ProductJson = {
    id: number;
    name: string;
    size: string;
    productTypeId: number;
    colors: ColorJson[];
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

export enum ModalTypeEnum {
    ADD = "Ajouter",
    UPDATE = "Modifier",
    DELETE = "Supprimer"
}