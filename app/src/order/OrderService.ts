import {BaseService} from "../utilities/BaseService";
import {OrderJson} from "./OrderJson";
import {OrderTypeEnum} from "./OrderTypeEnum";
import {OrderStatusEnum} from "./OrderStatusEnum";

export class OrderService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<OrderJson[]> {
        const data = await this.prisma.order.findMany();
        return data.map((c: any) => OrderJson.from(c));
    };

    async getById(orderId: number): Promise<OrderJson> {
        return OrderJson.from(
            await this.prisma.order.findUnique({
                    where: { id: orderId }
            })
        );
    };

    async add(order: OrderJson): Promise<OrderJson> {
        // TODO: add logic for products
        // TODO: add logic for expenses
        return OrderJson.from(
            await this.prisma.order.create({
                data: {
                    customerId: order.getCustomerId(),
                    supplierId: order.getSupplierId(),
                    orderType: order.getOrderType() == OrderTypeEnum.UNKNOWN ? '' : order.getOrderType(),
                    orderStatus: order.getOrderStatus() == OrderStatusEnum.UNKNOWN ? '' : order.getOrderStatus(),
                    totalPrice: order.getTotalPrice(),
                    date: order.getDate()
                }
            })
        );
    };

    async update(orderId: number, order: any): Promise<OrderJson> {
        // TODO: add logic for products
        // TODO: add logic for expenses
        // TODO: add logic for deliveries
        return OrderJson.from(
            await this.prisma.order.update({
                where: { id: orderId },
                data: {
                    customerId: order.getCustomerId(),
                    supplierId: order.getSupplierId(),
                    orderType: order.getOrderType() == OrderTypeEnum.UNKNOWN ? '' : order.getOrderType(),
                    orderStatus: order.getOrderStatus() == OrderStatusEnum.UNKNOWN ? '' : order.getOrderStatus(),
                    totalPrice: order.getTotalPrice(),
                    date: order.getDate()
                }
            })
        );
    }

    async delete(orderId: number): Promise<void> {
        await this.prisma.order.delete({
            where: { id: orderId }
        });
    }
}