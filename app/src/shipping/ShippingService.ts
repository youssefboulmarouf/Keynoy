import {BaseService} from "../utilities/BaseService";
import {ExpenseService} from "../expense/ExpenseService";
import {ExpenseJson} from "../expense/ExpenseJson";
import {ShippingJson} from "./ShippingJson";
import {OrderService} from "../order/OrderService";
import {OrderStatusEnum} from "../order/OrderStatusEnum";
import {OrderTypeEnum} from "../order/OrderTypeEnum";
import {OrderJson} from "../order/OrderJson";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";

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
        return data.map(ShippingJson.from);
    };

    async getById(orderId: number): Promise<ShippingJson> {
        this.logger.log(`Get shipping details by [orderId:${orderId}]`);
        const data = await this.prisma.shipping.findUnique({
            where: { orderId }
        });

        NotFoundError.throwIf(!data, `Shipping details by [orderId:${orderId}] not found`);

        return ShippingJson.from(data);
    };

    async add(shippingJson: ShippingJson): Promise<ShippingJson> {
        this.logger.log(`Adding shipping details to order with [id=${shippingJson.getOrderId()}]`);
        const existingOrder = await this.orderService.getById(shippingJson.getOrderId());

        BadRequestError.throwIf(
            existingOrder.getOrderStatus() != OrderStatusEnum.FINISHED,
            `Order with [status=${existingOrder.getOrderStatus()}] cannot be shipped`
        );

        BadRequestError.throwIf(
            existingOrder.getOrderType() == OrderTypeEnum.BUY,
            `Order with [type=${existingOrder.getOrderType()}] cannot be shipped`
        );

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

        BadRequestError.throwIf(orderId != shippingJson.getOrderId(), `Shipping id mismatch`);

        const existingOrder = await this.orderService.getById(shippingJson.getOrderId());
        BadRequestError.throwIf(existingOrder.getOrderStatus() == OrderStatusEnum.DELIVERED, `Order is delivered`);

        this.logger.log(`Delivery entry updated`);
        await this.prisma.shipping.update({
            where: { orderId },
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

        BadRequestError.throwIf(
            existingOrder.getOrderStatus() == OrderStatusEnum.DELIVERED,
            `Delivered order cannot be deleted`
        );

        this.logger.log(`Update order status to finished`);
        await this.updateOrder(existingOrder, OrderStatusEnum.FINISHED);

        this.logger.log(`Deleting shipping details`);
        await this.prisma.shipping.delete({
            where: { orderId }
        });
    }

    async delivered(orderId: number, shippingJson: ShippingJson) {
        this.logger.log(`Updating delivery details to order with [id=${shippingJson.getOrderId()}]`);

        BadRequestError.throwIf(orderId != shippingJson.getOrderId(), `Shipping id mismatch`);

        const existingOrder = await this.orderService.getById(shippingJson.getOrderId());
        BadRequestError.throwIf(
            existingOrder.getOrderStatus() != OrderStatusEnum.SHIPPED,
            `Order with [status=${existingOrder.getOrderStatus()}] not be delivered`
        );

        await this.updateOrder(existingOrder, OrderStatusEnum.DELIVERED);

        const existingShippingDetails = await this.getById(shippingJson.getOrderId());

        this.logger.log(`Delivery entry updated`);
        await this.prisma.shipping.update({
            where: { orderId },
            data: {
                orderId: existingShippingDetails.getOrderId(),
                shipperId: existingShippingDetails.getShipperId(),
                shippingDate: existingShippingDetails.getShippingDate(),
                deliveryDate: shippingJson.getDeliveryDate(),
                price: existingShippingDetails.getPrice()
            }
        });

        this.logger.log("Shipping marked as delivered");

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