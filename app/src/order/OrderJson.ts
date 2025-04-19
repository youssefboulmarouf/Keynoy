import {OrderTypeEnum, orderTypeFromString} from "./OrderTypeEnum";
import {OrderStatusEnum, orderStatusFromNumber} from "./OrderStatusEnum";
import {OrderLineJson} from "./OrderLineJson";

export class OrderJson {
    private readonly id: number;
    private readonly customerId: number;
    private readonly supplierId: number;
    private readonly orderType: OrderTypeEnum;
    private readonly orderStatus: OrderStatusEnum;
    private readonly totalPrice: number;
    private readonly date: Date;
    private readonly designUrl: string;
    private readonly orderLines: OrderLineJson[];

    constructor(
        id: number,
        customerId: number,
        supplierId: number,
        orderType: string,
        orderStatus: number,
        totalPrice: number,
        date: Date,
        designUrl: string,
        orderLines: OrderLineJson[]
    ) {
        this.id = id;
        this.customerId = customerId;
        this.supplierId = supplierId;
        this.orderType = orderTypeFromString(orderType);
        this.orderStatus = orderStatusFromNumber(orderStatus);
        this.totalPrice = totalPrice;
        this.date = date;
        this.designUrl = designUrl;
        this.orderLines = orderLines;
    }

    public getId(): number {
        return this.id;
    }

    public getCustomerId(): number {
        return this.customerId;
    }

    public getSupplierId(): number {
        return this.supplierId;
    }

    public getOrderType(): OrderTypeEnum {
        return this.orderType;
    }

    public getOrderStatus(): OrderStatusEnum {
        return this.orderStatus;
    }

    public getTotalPrice(): number {
        return this.totalPrice;
    }

    public getDate(): Date {
        return this.date;
    }

    public getDesignUrl(): string {
        return this.designUrl;
    }

    public getOrderLines(): OrderLineJson[] {
        return this.orderLines;
    }

    public static fromObject(body: any): OrderJson {
        return new OrderJson(
            Number(body.id),
            Number(body.customerId),
            Number(body.supplierId),
            body.orderType,
            body.orderStatus,
            Number(body.totalPrice),
            body.date,
            body.designUrl,
            body.orderLines.map((ol: any) => OrderLineJson.fromObject(ol)),
        )
    }

    public static fromObjectAndLines(body: any, orderLines: OrderLineJson[]): OrderJson {
        return new OrderJson(
            Number(body.id),
            Number(body.customerId),
            Number(body.supplierId),
            body.orderType,
            body.orderStatus,
            Number(body.totalPrice),
            body.date,
            body.designUrl,
            orderLines
        )
    }
}