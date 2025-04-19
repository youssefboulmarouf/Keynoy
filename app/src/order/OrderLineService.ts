import {BaseService} from "../utilities/BaseService";
import {OrderLineJson} from "./OrderLineJson";
import {ColorJson} from "../color/ColorJson";
import {ColorService} from "../color/ColorService";

export class OrderLineService extends BaseService {
    private readonly colorService: ColorService;

    constructor() {
        super(OrderLineService.name);
        this.colorService = new ColorService();
    }

    async get(): Promise<OrderLineJson[]> {
        this.logger.log("Get all order lines");
        const lines = await this.prisma.orderLine.findMany();
        return await Promise.all(lines.map(async line =>
            OrderLineJson.fromObjectAndColors(
                line,
                await this.colorService.getByOrderLineId(line.orderId, line.productId)
            )
        ));
    }

    async getById(orderId: number): Promise<OrderLineJson[]> {
        this.logger.log(`Get order lines by [orderId: ${orderId}]`);
        const lines = await this.prisma.orderLine.findMany({where: { orderId }});
        return await Promise.all(lines.map(async line =>
            OrderLineJson.fromObjectAndColors(
                line,
                await this.colorService.getByOrderLineId(line.orderId, line.productId)
            )
        ));
    }

    async add(orderLine: OrderLineJson): Promise<OrderLineJson> {
        this.logger.log(`Create new order line`, orderLine);

        return OrderLineJson.fromObjectAndColors(
            await this.prisma.orderLine.create({
                data: {
                    orderId: orderLine.getOrderId(),
                    productId: orderLine.getProductId(),
                    quantity: orderLine.getQuantity(),
                    unitPrice: orderLine.getUnitPrice(),
                    paintType: orderLine.getPaintType(),
                }
            }),
            await this.setOrderLineColors(orderLine.getOrderId(), orderLine.getProductId(), orderLine.getColors())
        );
    };

    // Don't use this, instead of updating, delete then add
    update(id: number, entity: any): any {
        this.logger.log(`This method should not be used`);
    }

    async delete(orderId: number): Promise<void> {
        this.logger.log(`Delete all order lines by [orderId:${orderId}]`);
        await this.prisma.orderLineColor.deleteMany({ where: { orderId} });
        await this.prisma.orderLine.deleteMany({
            where: { orderId }
        });
    }

    async deleteUnique(orderId: number, productId: number): Promise<void> {
        this.logger.log(`Delete unique order line by [orderId:${orderId} && productId:${productId}]`);
        await this.prisma.orderLineColor.deleteMany({ where: { orderId, productId } });
        await this.prisma.orderLine.delete({
            where: {
                orderId_productId: { orderId, productId }
            }
        });
    }

    async addList(orderLines: OrderLineJson[], orderId: number): Promise<OrderLineJson[]> {
        this.logger.log(`Create multiple order lines`);
        const savedOrderLines: OrderLineJson[] = [];
        await Promise.all(orderLines.map(async (line) => {
            line.setOrderId(orderId);
            savedOrderLines.push(await this.add(line))
        }));
        return savedOrderLines;
    };

    private async setOrderLineColors(orderId: number, productId: number, colors: ColorJson[]): Promise<ColorJson[]> {
        await this.prisma.orderLineColor.deleteMany({ where: { orderId, productId } });

        if (!colors?.length) return [];

        await this.prisma.orderLineColor.createMany({
            data: colors.map((c) => ({
                orderId,
                productId,
                colorId: c.getId()
            })),
            skipDuplicates: true
        });

        return await this.colorService.getByOrderLineId(orderId, productId)
    }
}