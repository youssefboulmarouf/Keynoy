import {OrderTypeEnum, orderTypeFromString} from "./OrderTypeEnum";
import {OrderStatusEnum, orderStatusFromNumber} from "./OrderStatusEnum";
import {OrderLineJson} from "./order-line/OrderLineJson";

export class OrderJson {
    private readonly id: number;
    private readonly companyId: number;
    private readonly orderType: OrderTypeEnum;
    private readonly orderStatus: OrderStatusEnum;
    private readonly totalPrice: number;
    private readonly date: Date;
    private readonly inventoryUpdated: boolean;
    private readonly expenseUpdated: boolean;
    private readonly orderLines: OrderLineJson[];

    constructor(
        id: number,
        companyId: number,
        orderType: string,
        orderStatus: number,
        totalPrice: number,
        date: Date,
        inventoryUpdated: boolean,
        expenseUpdated: boolean,
        orderLines: OrderLineJson[]
    ) {
        this.id = id;
        this.companyId = companyId;
        this.orderType = orderTypeFromString(orderType);
        this.orderStatus = orderStatusFromNumber(orderStatus);
        this.totalPrice = totalPrice;
        this.date = date;
        this.inventoryUpdated = inventoryUpdated;
        this.expenseUpdated = expenseUpdated;
        this.orderLines = orderLines;
    }

    public getId(): number {
        return this.id;
    }

    public getCompanyId(): number {
        return this.companyId;
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

    public isInventoryUpdated(): boolean {
        return this.inventoryUpdated;
    }

    public isExpenseUpdated(): boolean {
        return this.expenseUpdated;
    }

    public getOrderLines(): OrderLineJson[] {
        return this.orderLines;
    }

    public static fromObject(body: any): OrderJson {
        return new OrderJson(
            Number(body.id),
            Number(body.companyId),
            body.orderType,
            body.orderStatus,
            Number(body.totalPrice),
            body.date,
            body.inventoryUpdated,
            body.expenseUpdated,
            body.orderLines.map((ol: any) => OrderLineJson.fromObject(ol))
        )
    }

    public static fromObjectAndLines(body: any, orderLines: OrderLineJson[]): OrderJson {
        return new OrderJson(
            Number(body.id),
            Number(body.companyId),
            body.orderType,
            body.orderStatus,
            Number(body.totalPrice),
            body.date,
            body.inventoryUpdated,
            body.expenseUpdated,
            orderLines
        )
    }
}