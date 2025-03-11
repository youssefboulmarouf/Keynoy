export class OrderLineJson {
    private orderId: number;
    private readonly productId: number;
    private readonly quantity: number;
    private readonly unitPrice: number;

    constructor(
        orderId: number,
        productId: number,
        quantity: number,
        unitPrice: number
    ) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public setOrderId(orderId: number): void {
        this.orderId = orderId;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public getProductId(): number {
        return this.productId;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getUnitPrice(): number {
        return this.unitPrice;
    }

    public static from(body: any): OrderLineJson {
        return new OrderLineJson(
            Number(body.orderId),
            Number(body.productId),
            Number(body.quantity),
            Number(body.unitPrice),
        )
    }
}