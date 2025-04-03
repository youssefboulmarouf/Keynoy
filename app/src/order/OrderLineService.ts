import {BaseService} from "../utilities/BaseService";
import {OrderLineJson} from "./OrderLineJson";

export class OrderLineService extends BaseService {
    constructor() {
        super(OrderLineService.name);
    }

    async get(): Promise<OrderLineJson[]> {
        this.logger.log(`Get all order lines`);
        const data = await this.prisma.orderLine.findMany();
        return data.map((c: any) => OrderLineJson.from(c));
    };

    async getById(orderId: number): Promise<OrderLineJson[]> {
        this.logger.log(`Get order line by [orderId:${orderId}]`);
        const data = await this.prisma.orderLine.findMany({
            where: { orderId: orderId }
        });

        return data.map((c: any) => OrderLineJson.from(c));
    };

    async add(orderLine: OrderLineJson): Promise<OrderLineJson> {
        this.logger.log(`Create new order line`, orderLine);
        return OrderLineJson.from(
            await this.prisma.orderLine.create({
                data: {
                    orderId: orderLine.getOrderId(),
                    productId: orderLine.getProductId(),
                    quantity: orderLine.getQuantity(),
                    unitPrice: orderLine.getUnitPrice(),
                }
            })
        );
    };

    // Don't use this, instead of updating, delete then add
    update(id: number, entity: any): any {
        this.logger.log(`This method should not be used`);
    }

    async delete(orderId: number): Promise<void> {
        this.logger.log(`Delete all order lines by [orderId:${orderId}]`);
        await this.prisma.orderLine.deleteMany({
            where: { orderId: orderId }
        });
    }

    async deleteUnique(orderId: number, productId: number): Promise<void> {
        this.logger.log(`Delete unique order line by [orderId:${orderId} && productId:${productId}]`);
        await this.prisma.orderLine.delete({
            where: {
                orderId_productId: {
                    orderId,
                    productId,
                },
            },
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
}