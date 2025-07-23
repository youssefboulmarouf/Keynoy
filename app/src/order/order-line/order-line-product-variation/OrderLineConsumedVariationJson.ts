export class OrderLineConsumedVariationJson {
    private readonly orderLineId: number;
    private readonly productVariationId: number;
    private readonly quantity: number;
    private readonly finalQuantity: number;

    constructor(
        orderLineId: number,
        productVariationId: number,
        quantity: number,
        finalQuantity: number
    ) {
        this.orderLineId = orderLineId;
        this.productVariationId = productVariationId;
        this.quantity = quantity;
        this.finalQuantity = finalQuantity;
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

    public getFinalQuantity(): number {
        return this.finalQuantity;
    }

    public static fromObject(body: any): OrderLineConsumedVariationJson {
        return new OrderLineConsumedVariationJson(
            Number(body.orderLineId),
            Number(body.productVariationId),
            Number(body.quantity),
            Number(body.finalQuantity)
        )
    }
}