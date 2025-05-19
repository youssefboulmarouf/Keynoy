import {OrderLineProductVariationJson} from "./order-line-product-variation/OrderLineProductVariationJson";

export class OrderLineJson {
    private readonly id: number;
    private readonly orderId: number;
    private readonly designId: number;
    private readonly orderLineProductVariations: OrderLineProductVariationJson[];

    constructor(
        id: number,
        orderId: number,
        designId: number,
        orderLineProductVariations: OrderLineProductVariationJson[]
    ) {
        this.id = id;
        this.orderId = orderId;
        this.designId = designId;
        this.orderLineProductVariations = orderLineProductVariations;
    }

    public getId(): number {
        return this.id;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public getDesignId(): number {
        return this.designId;
    }

    public getOrderLineProductVariations(): OrderLineProductVariationJson[] {
        return this.orderLineProductVariations;
    }

    public static fromObject(body: any): OrderLineJson {
        return new OrderLineJson(
            Number(body.id),
            Number(body.orderId),
            Number(body.designId),
            body.orderLineProductVariations.map(OrderLineProductVariationJson.fromObject)
        )
    }

    public static fromObjectAndVariations(body: any, orderLineProductVariations: OrderLineProductVariationJson[]): OrderLineJson {
        return new OrderLineJson(
            Number(body.id),
            Number(body.orderId),
            Number(body.designId),
            orderLineProductVariations
        )
    }
}