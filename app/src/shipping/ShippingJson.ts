export class ShippingJson {
    private readonly orderId: number;
    private readonly dcId: number;
    private readonly shippingDate: Date;
    private readonly deliveryDate: Date;
    private readonly price: number;

    constructor(
        orderId: number,
        dcId: number,
        shippingDate: Date,
        deliveryDate: Date,
        price: number
    ) {
        this.orderId = orderId;
        this.dcId = dcId;
        this.shippingDate = shippingDate;
        this.deliveryDate = deliveryDate;
        this.price = price;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public getDcId(): number {
        return this.dcId;
    }

    public getShippingDate(): Date {
        return this.shippingDate;
    }

    public getDeliveryDate(): Date {
        return this.deliveryDate;
    }

    public getPrice(): number {
        return this.price;
    }

    public static from(body: any): ShippingJson {
        return new ShippingJson(
            Number(body.orderId),
            Number(body.dcId),
            body.shippingDate,
            body.deliveryDate,
            Number(body.price)
        )
    }
}