export class ShippingJson {
    private readonly orderId: number;
    private readonly companyId: number;
    private readonly shippingDate: Date;
    private readonly deliveryDate: Date | null;
    private readonly price: number;

    constructor(
        orderId: number,
        companyId: number,
        shippingDate: Date,
        deliveryDate: Date | null,
        price: number
    ) {
        this.orderId = orderId;
        this.companyId = companyId;
        this.shippingDate = shippingDate;
        this.deliveryDate = deliveryDate;
        this.price = price;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public getCompanyId(): number {
        return this.companyId;
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
            Number(body.companyId),
            body.shippingDate,
            body.deliveryDate,
            Number(body.price)
        )
    }
}