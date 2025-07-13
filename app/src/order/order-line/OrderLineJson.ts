import {OrderLineConsumedVariationJson} from "./order-line-product-variation/OrderLineConsumedVariationJson";

export class OrderLineJson {
    private readonly id: number;
    private readonly orderId: number;
    private readonly designId: number | null;
    private readonly productVariationId: number;
    private readonly quantity: number;
    private readonly unitPrice: number;
    private readonly orderLineConsumedVariations: OrderLineConsumedVariationJson[];

    constructor(
        id: number,
        orderId: number,
        designId: number | null,
        productVariationId: number,
        quantity: number,
        unitPrice: number,
        orderLineConsumedVariations: OrderLineConsumedVariationJson[]
    ) {
        this.id = id;
        this.orderId = orderId;
        this.designId = designId;
        this.productVariationId = productVariationId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.orderLineConsumedVariations = orderLineConsumedVariations;
    }

    public getId(): number {
        return this.id;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public getDesignId(): number | null {
        return this.designId;
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

    public getOrderLineConsumedVariations(): OrderLineConsumedVariationJson[] {
        return this.orderLineConsumedVariations;
    }

    public static fromObject(body: any): OrderLineJson {
        return new OrderLineJson(
            Number(body.id),
            Number(body.orderId),
            body.designId ? Number(body.designId) : null,
            Number(body.productVariationId),
            Number(body.quantity),
            Number(body.unitPrice),
            body.orderLineConsumedVariations.map(OrderLineConsumedVariationJson.fromObject)
        )
    }

    public static fromObjectAndVariations(body: any, orderLineConsumedVariations: OrderLineConsumedVariationJson[]): OrderLineJson {
        return new OrderLineJson(
            Number(body.id),
            Number(body.orderId),
            body.designId ? Number(body.designId) : null,
            Number(body.productVariationId),
            Number(body.quantity),
            Number(body.unitPrice),
            orderLineConsumedVariations
        )
    }
}