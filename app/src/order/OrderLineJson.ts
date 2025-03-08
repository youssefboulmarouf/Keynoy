export class OrderLineJson {
    private readonly orderId: number;
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


    public getOrderId(): number {
        return this.orderId;
    }

    public getProductId(): number {
        return this.productId;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getInitPrice(): number {
        return this.unitPrice;
    }

    public static from(body: any): OrderLineJson {
        return new OrderLineJson(
            body.orderId,
            body.productId,
            body.quantity,
            body.unitPrice,
        )
    }
}