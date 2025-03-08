import {OrderTypeEnum, orderTypeFromString} from "./OrderTypeEnum";
import {OrderStatusEnum, orderStatusFromString} from "./OrderStatusEnum";
import {OrderLineJson} from "./OrderLineJson";

export class OrderJson {
    private readonly id: number;
    private readonly customerId: number;
    private readonly supplierId: number;
    private readonly orderType: OrderTypeEnum;
    private readonly orderStatus: OrderStatusEnum;
    private readonly totalPrice: number;
    private readonly date: Date;
    private readonly orderLines: OrderLineJson[];

    constructor(
        id: number,
        customerId: number,
        supplierId: number,
        orderType: string,
        orderStatus: string,
        totalPrice: number,
        date: Date,
        orderLines: OrderLineJson[]
    ) {
        this.id = id;
        this.customerId = customerId;
        this.supplierId = supplierId;
        this.orderType = orderTypeFromString(orderType);
        this.orderStatus = orderStatusFromString(orderStatus);
        this.totalPrice = totalPrice;
        this.date = date;
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

    public getOrderLines(): OrderLineJson[] {
        return this.orderLines;
    }

    public static fromRequest(body: any): OrderJson {
        return new OrderJson(
            body.id,
            body.customerId,
            body.supplierId,
            body.orderType,
            body.orderStatus,
            body.totalPrice,
            body.date,
            body.orderLines.map((ol: any) => OrderLineJson.from(ol)),
        )
    }

    public static fromDb(body: any, orderLines: OrderLineJson[]): OrderJson {
        return new OrderJson(
            body.id,
            body.customerId,
            body.supplierId,
            body.orderType,
            body.orderStatus,
            body.totalPrice,
            body.date,
            orderLines
        )
    }
}