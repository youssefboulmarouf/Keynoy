export class ShippingJson {
    private readonly orderId: number;
    private readonly shipperId: number;
    private readonly shippingDate: Date;
    private readonly deliveryDate: Date | null;
    private readonly price: number;

    constructor(
        orderId: number,
        shipperId: number,
        shippingDate: Date,
        deliveryDate: Date | null,
        price: number
    ) {
        this.orderId = orderId;
        this.shipperId = shipperId;
        this.shippingDate = shippingDate;
        this.deliveryDate = deliveryDate;
        this.price = price;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public getShipperId(): number {
        return this.shipperId;
    }

    public getShippingDate(): Date {
        return this.shippingDate;
    }

    public getDeliveryDate(): Date | null {
        return this.deliveryDate;
    }

    public getPrice(): number {
        return this.price;
    }

    public static from(body: any): ShippingJson {
        return new ShippingJson(
            Number(body.orderId),
            Number(body.shipperId),
            body.shippingDate,
            body.deliveryDate,
            Number(body.price)
        )
    }
}