export class OrderLineConsumedVariationJson {
    private readonly orderLineId: number;
    private readonly productVariationId: number;
    private readonly quantity: number;

    constructor(
        orderLineId: number,
        productVariationId: number,
        quantity: number
    ) {
        this.orderLineId = orderLineId;
        this.productVariationId = productVariationId;
        this.quantity = quantity;
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

    public static fromObject(body: any): OrderLineConsumedVariationJson {
        return new OrderLineConsumedVariationJson(
            Number(body.orderLineId),
            Number(body.productVariationId),
            Number(body.quantity)
        )
    }
}