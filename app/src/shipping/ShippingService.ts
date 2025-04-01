import {BaseService} from "../utilities/BaseService";
import {ExpenseService} from "../expense/ExpenseService";
import {ExpenseJson} from "../expense/ExpenseJson";
import AppError from "../utilities/AppError";
import {ShippingJson} from "./ShippingJson";
import {OrderService} from "../order/OrderService";
import {OrderStatusEnum} from "../order/OrderStatusEnum";
import {OrderTypeEnum} from "../order/OrderTypeEnum";
import {OrderJson} from "../order/OrderJson";

export class ShippingService extends BaseService {
    private readonly expenseService: ExpenseService;
    private readonly orderService: OrderService;

    constructor() {
        super(ShippingService.name);
        this.expenseService = new ExpenseService();
        this.orderService = new OrderService();
    }

    async get(): Promise<ShippingJson[]> {
        this.logger.log(`Get all shipping details`);
        const data = await this.prisma.shipping.findMany();
        return data.map((c: any) => ShippingJson.from(c));
    };

    async getById(orderId: number): Promise<ShippingJson> {
        this.logger.log(`Get shipping details by [orderId:${orderId}]`);
        const data = await this.prisma.shipping.findUnique({
            where: { orderId: orderId }
        });

        if (!data) {
            throw new AppError("Not Found", 404, `Shipping details by [orderId:${orderId}] not found`);
        }

        return ShippingJson.from(data);
    };

    async add(shippingJson: ShippingJson): Promise<ShippingJson> {
        this.logger.log(`Adding shipping details to order with [id=${shippingJson.getOrderId()}]`);
        const existingOrder = await this.orderService.getById(shippingJson.getOrderId());

        if (existingOrder.getOrderStatus() != OrderStatusEnum.FINISHED) {
            throw new AppError(
                "Bad Request",
                400,
                `Order with [status=${existingOrder.getOrderStatus()}] cannot be shipped`
            );
        }

        if (existingOrder.getOrderType() == OrderTypeEnum.BUY) {
            throw new AppError(
                "Bad Request",
                400,
                `Order with [type=${existingOrder.getOrderType()}] cannot be shipped`
            );
        }

        await this.updateOrder(existingOrder, OrderStatusEnum.SHIPPED);

        this.logger.log(`Delivery entry created`);
        const data = await this.prisma.shipping.create({
            data: {
                orderId: shippingJson.getOrderId(),
                shipperId: shippingJson.getShipperId(),
                shippingDate: shippingJson.getShippingDate(),
                deliveryDate: null,
                price: shippingJson.getPrice()
            }
        });

        return ShippingJson.from(data);
    };

    async update(orderId: number, shippingJson: ShippingJson): Promise<void> {
        this.logger.log(`Updating shipping details of order with [id=${shippingJson.getOrderId()}]`);

        if (orderId != shippingJson.getOrderId()) {
            throw new AppError("Bad Request", 400, `Shipping id mismatch`);
        }

        const existingOrder = await this.orderService.getById(shippingJson.getOrderId());

        if (existingOrder.getOrderStatus() == OrderStatusEnum.DELIVERED) {
            throw new AppError("Bad Request", 400, `Order is delivered`);
        }

        this.logger.log(`Delivery entry updated`);
        await this.prisma.shipping.update({
            where: { orderId: shippingJson.getOrderId() },
            data: {
                orderId: shippingJson.getOrderId(),
                shipperId: shippingJson.getShipperId(),
                shippingDate: shippingJson.getShippingDate(),
                deliveryDate: null,
                price: shippingJson.getPrice()
            }
        });
    }

    async delete(orderId: number): Promise<void> {
        this.logger.log(`Deleting shipping details of order with [id=${orderId}]`);
        const existingOrder = await this.orderService.getById(orderId);

        if (existingOrder.getOrderStatus() == OrderStatusEnum.DELIVERED) {
            throw new AppError("Bad Request", 400, `Delivered order cannot be deleted`);
        }

        this.logger.log(`Update order status to finished`);
        await this.prisma.order.update({
            where: { id: existingOrder.getId() },
            data: {
                customerId: existingOrder.getCustomerId(),
                supplierId: existingOrder.getSupplierId(),
                orderType: existingOrder.getOrderType(),
                orderStatus: OrderStatusEnum.FINISHED,
                totalPrice: existingOrder.getTotalPrice(),
                date: existingOrder.getDate()
            }
        });

        this.logger.log(`Deleting shipping details`);
        await this.prisma.shipping.delete({
            where: { orderId: orderId }
        });
    }

    async delivered(orderId: number, shippingJson: ShippingJson) {
        this.logger.log(`Updating delivery details to order with [id=${shippingJson.getOrderId()}]`);

        if (orderId != shippingJson.getOrderId()) {
            throw new AppError("Bad Request", 400, `Shipping id mismatch`);
        }

        const existingOrder = await this.orderService.getById(shippingJson.getOrderId());

        if (existingOrder.getOrderStatus() != OrderStatusEnum.SHIPPED) {
            throw new AppError(
                "Bad Request",
                400,
                `Order with [status=${existingOrder.getOrderStatus()}] not be delivered`
            );
        }

        await this.updateOrder(existingOrder, OrderStatusEnum.DELIVERED);

        const existingShippingDetails = await this.getById(shippingJson.getOrderId());

        this.logger.log(`Delivery entry updated`);
        await this.prisma.shipping.update({
            where: { orderId: existingShippingDetails.getOrderId() },
            data: {
                orderId: existingShippingDetails.getOrderId(),
                shipperId: existingShippingDetails.getShipperId(),
                shippingDate: existingShippingDetails.getShippingDate(),
                deliveryDate: shippingJson.getDeliveryDate(),
                price: existingShippingDetails.getPrice()
            }
        });

        if (shippingJson.getPrice() > 0) {
            this.logger.log(`Adding Delivery Expense for SELL order`);
            await this.expenseService.add(new ExpenseJson(
                0,
                "Order Delivery",
                existingShippingDetails.getPrice(),
                shippingJson.getDeliveryDate() || new Date(),
                existingShippingDetails.getOrderId()
            ));
        }
    }

    private async updateOrder(existingOrder: OrderJson, orderStatus: OrderStatusEnum): Promise<void> {
        this.logger.log(`Update order status from [${existingOrder.getOrderStatus()}] to [${orderStatus}]`);
        await this.prisma.order.update({
            where: { id: existingOrder.getId() },
            data: {
                customerId: existingOrder.getCustomerId(),
                supplierId: existingOrder.getSupplierId(),
                orderType: existingOrder.getOrderType(),
                orderStatus: orderStatus,
                totalPrice: existingOrder.getTotalPrice(),
                date: existingOrder.getDate()
            }
        });
    }
}