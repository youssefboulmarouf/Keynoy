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

    async getByOrderId(orderId: number): Promise<ShippingJson> {
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
            existingOrder.getOrderType() == OrderTypeEnum.BUY,
            `Order with [type=${existingOrder.getOrderType()}] cannot be shipped`
        );

        BadRequestError.throwIf(
            existingOrder.getOrderStatus() != OrderStatusEnum.FINISHED,
            `Order with [status=${existingOrder.getOrderStatus()}] cannot be shipped`
        );

        this.logger.log("Order marked as shipped");
        await this.updateOrderStatus(existingOrder, OrderStatusEnum.SHIPPED);

        this.logger.log(`Delivery entry created`);
        const data = await this.prisma.shipping.create({
            data: {
                orderId: shippingJson.getOrderId(),
                companyId: shippingJson.getCompanyId(),
                shippingCode: shippingJson.getShippingCode(),
                shippingDate: shippingJson.getShippingDate(),
                deliveryDate: shippingJson.getDeliveryDate(),
                price: shippingJson.getPrice()
            }
        });

        if (shippingJson.getDeliveryDate()) {
            await this.delivered(existingOrder, shippingJson)
        }

        return ShippingJson.from(data);
    };

    async update(orderId: number, shippingJson: ShippingJson): Promise<ShippingJson> {
        this.logger.log(`Updating shipping details of order with [id=${shippingJson.getOrderId()}]`);

        BadRequestError.throwIf(orderId != shippingJson.getOrderId(), `Shipping id mismatch`);

        const existingOrder = await this.orderService.getById(shippingJson.getOrderId());

        BadRequestError.throwIf(
            existingOrder.getOrderType() == OrderTypeEnum.BUY,
            `Order with [type=${existingOrder.getOrderType()}] cannot be shipped`
        );

        BadRequestError.throwIf(existingOrder.getOrderStatus() == OrderStatusEnum.DELIVERED, `Order is delivered`);

        BadRequestError.throwIf(
            existingOrder.getOrderStatus() != OrderStatusEnum.SHIPPED,
            `Order with [status=${existingOrder.getOrderStatus()}] not be delivered`
        );

        this.logger.log(`Delivery entry updated`);
        const data = await this.prisma.shipping.update({
            where: { orderId },
            data: {
                orderId: shippingJson.getOrderId(),
                companyId: shippingJson.getCompanyId(),
                shippingCode: shippingJson.getShippingCode(),
                shippingDate: shippingJson.getShippingDate(),
                deliveryDate: shippingJson.getDeliveryDate(),
                price: shippingJson.getPrice()
            }
        });

        if (shippingJson.getDeliveryDate()) {
            await this.delivered(existingOrder, shippingJson)
        }

        return ShippingJson.from(data);
    }

    async delete(orderId: number): Promise<void> {
        this.logger.log(`Deleting shipping details of order with [id=${orderId}]`);
        const existingOrder = await this.orderService.getById(orderId);

        BadRequestError.throwIf(
            existingOrder.getOrderStatus() == OrderStatusEnum.DELIVERED,
            `Delivered order cannot be deleted`
        );

        this.logger.log(`Update order status to finished`);
        await this.updateOrderStatus(existingOrder, OrderStatusEnum.FINISHED);

        this.logger.log(`Deleting shipping details`);
        await this.prisma.shipping.delete({
            where: { orderId }
        });
    }

    async delivered(existingOrder: OrderJson, shippingJson: ShippingJson) {
        this.logger.log("Order marked as delivered");
        await this.updateOrderStatus(existingOrder, OrderStatusEnum.DELIVERED);

        this.logger.log(`Adding Delivery Expense for SELL order`);
        await this.expenseService.add(new ExpenseJson(
            0,
            `Livraison Commande [${shippingJson.getOrderId()}]`,
            shippingJson.getPrice(),
            shippingJson.getDeliveryDate() || new Date(),
            shippingJson.getOrderId(),
            false,
            true
        ));

        await this.updateOrderExpense(existingOrder);
    }

    private async updateOrderStatus(existingOrder: OrderJson, orderStatus: OrderStatusEnum): Promise<void> {
        this.logger.log(`Update order status from [${existingOrder.getOrderStatus()}] to [${orderStatus}]`);
        await this.prisma.order.update({
            where: { id: existingOrder.getId() },
            data: {
                orderStatus: orderStatus,
            }
        });
    }

    private async updateOrderExpense(existingOrder: OrderJson): Promise<void> {
        this.logger.log(`Update order expenses`);
        await this.prisma.order.update({
            where: { id: existingOrder.getId() },
            data: {
                expenseUpdated: true
            }
        });
    }
}