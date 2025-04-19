import {PaintTypeEnum, paintTypeFromString} from "./PaintTypeEnum";
import {ColorJson} from "../color/ColorJson";

export class OrderLineJson {
    private orderId: number;
    private readonly productId: number;
    private readonly quantity: number;
    private readonly unitPrice: number;
    private readonly paintType: PaintTypeEnum;
    private readonly colors: ColorJson[];

    constructor(
        orderId: number,
        productId: number,
        quantity: number,
        unitPrice: number,
        paintType: PaintTypeEnum,
        colors: ColorJson[]
    ) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.paintType = paintType;
        this.colors = colors;
    }

    public setOrderId(orderId: number): void {
        this.orderId = orderId;
    }

    public getOrderId(): number {
        return this.orderId;
    }

    public getProductId(): number {
        return this.productId;
    }

    public getQuantity(): number {
        return this.quantity;
    }

    public getUnitPrice(): number {
        return this.unitPrice;
    }

    public getPaintType(): PaintTypeEnum {
        return this.paintType;
    }

    public getColors(): ColorJson[] {
        return this.colors;
    }

    public static fromObject(body: any): OrderLineJson {
        return new OrderLineJson(
            Number(body.orderId),
            Number(body.productId),
            Number(body.quantity),
            Number(body.unitPrice),
            paintTypeFromString(body.paintType),
            body.colors.map(ColorJson.from),
        )
    }

    public static fromObjectAndColors(body: any, colors: ColorJson[]): OrderLineJson {
        return new OrderLineJson(
            Number(body.orderId),
            Number(body.productId),
            Number(body.quantity),
            Number(body.unitPrice),
            paintTypeFromString(body.paintType),
            colors,
        )
    }
}