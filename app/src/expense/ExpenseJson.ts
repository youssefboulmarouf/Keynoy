export class ExpenseJson {
    private readonly id: number;
    private readonly name: string;
    private readonly totalPrice: number;
    private readonly date: Date;
    private readonly orderId: number;

    constructor(
        id: number,
        name: string,
        totalPrice: number,
        date: Date,
        orderId: number
    ) {
        this.id = id;
        this.name = name;
        this.totalPrice = totalPrice;
        this.date = date;
        this.orderId = orderId;
    }

    public getId(): number {
        return this.id;
    }

    public getTotalPrice(): number {
        return this.totalPrice;
    }

    public getDate(): Date {
        return this.date;
    }

    public getName(): string {
        return this.name;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public static from(body: any): ExpenseJson {
        return new ExpenseJson(
            Number(body.id),
            body.name,
            Number(body.totalPrice),
            body.date,
            Number(body.orderId)
        )
    }
}