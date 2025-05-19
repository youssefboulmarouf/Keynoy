export class OrderLineProductVariationJson {
    private readonly orderLineId: number;
    private readonly productVariationId: number;
    private readonly quantity: number;
    private readonly unitPrice: number;

    constructor(
        orderLineId: number,
        productVariationId: number,
        quantity: number,
        unitPrice: number
    ) {
        this.orderLineId = orderLineId;
        this.productVariationId = productVariationId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public getOrderLineId(): number {
        return this.orderLineId;
    }

    public getProductVariationId(): number {
        return this.productVariationId;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getUnitPrice(): number {
        return this.unitPrice;
    }

    public static fromObject(body: any): OrderLineProductVariationJson {
        return new OrderLineProductVariationJson(
            Number(body.orderLineId),
            Number(body.productVariationId),
            Number(body.quantity),
            Number(body.unitPrice)
        )
    }
}