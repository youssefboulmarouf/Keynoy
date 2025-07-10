export type CompanyJson = {
    id: number;
    name: string;
    companyType: string;
    phone: string;
    location: string;
}

export type CompanyDesignJson = {
    id: number;
    designName: string;
    companyId: number;
    designImages: DesignImageJson[],
}

export type DesignImageJson = {
    id: number;
    imageUrl: string;
    companyDesignId: number;
}

export enum CompanyTypeEnum {
    SHIPPERS =  "Livreur",
    SUPPLIERS = "Fournisseur",
    CUSTOMERS = "Client",
}

export type ProductTypeJson = {
    id: number;
    name: string;
    isPrintable: boolean;
    isPaint: boolean;
    isTool: boolean;
};

export type ProductJson = {
    id: number;
    name: string;
    isSellable: boolean;
    isLayer: boolean;
    productTypeId: number;
}

export type ProductVariationJson = {
    id: number;
    productId: number;
    colorId: number;
    name: string;
    size: string;
    quantity: number;
    threshold: number;
}

export type OrderJson = {
    id: number;
    companyId: number;
    orderType: OrderTypeEnum;
    orderStatus: OrderStatusEnum;
    totalPrice: number;
    date: Date;
    inventoryUpdated: boolean;
    expenseUpdated: boolean;
    orderLines: OrderLineJson[];
}

export type OrderLineJson = {
    id: number;
    orderId: number;
    designId: number | null;
    orderLineProductVariations: OrderLineProductVariationJson[];
}

export type OrderLineProductVariationJson = {
    orderLineId: number;
    productVariationId: number;
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

export type ExpenseJson = {
    id: number;
    name: string;
    totalPrice: number;
    date: Date;
    orderId: number;
    isOrder: boolean;
    isShipping: boolean;
}

export type ColorJson = {
    id: number;
    name: string;
    htmlCode: string;
}

export type ShippingJson = {
    orderId: number;
    companyId: number;
    shippingCode: string;
    shippingDate: Date;
    deliveryDate: Date | null;
    price: number;
}

export enum ModalTypeEnum {
    ADD = "Ajouter",
    UPDATE = "Modifier",
    DELETE = "Supprimer"
}