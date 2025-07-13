import {BaseService} from "../utilities/BaseService";
import {OrderJson} from "./OrderJson";
import {OrderTypeEnum} from "./OrderTypeEnum";
import {OrderStatusEnum, statusToString} from "./OrderStatusEnum";
import {OrderLineJson} from "./order-line/OrderLineJson";
import {OrderLineService} from "./order-line/OrderLineService";
import {ExpenseService} from "../expense/ExpenseService";
import {ExpenseJson} from "../expense/ExpenseJson";
import BadRequestError from "../utilities/errors/BadRequestError";
import {ProductVariationService} from "../product/product-variation/ProductVariationService";
import NotFoundError from "../utilities/errors/NotFoundError";

export class OrderService extends BaseService {
    private readonly orderLineService: OrderLineService;
    private readonly expenseService: ExpenseService;
    private readonly productVariationService: ProductVariationService;

    constructor() {
        super(OrderService.name);
        this.orderLineService = new OrderLineService();
        this.expenseService = new ExpenseService();
        this.productVariationService = new ProductVariationService();
    }

    async get(): Promise<OrderJson[]> {
        this.logger.log("Get all orders");
        const orders = await this.prisma.order.findMany();
        return Promise.all(
            orders.map(async (order) =>
                OrderJson.fromObjectAndLines(
                    order,
                    await this.orderLineService.getByOrderId(order.id)
                )
            )
        );
    }

    async getById(orderId: number): Promise<OrderJson> {
        this.logger.log(`Get order by [id:${orderId}]`);
        const orderData = await this.prisma.order.findUnique({
            where: { id: orderId }
        });

        NotFoundError.throwIf(!orderData, `Order with [id:${orderId}] not found`);

        return OrderJson.fromObjectAndLines(
            orderData,
            await this.orderLineService.getByOrderId(orderId)
        );
    };

    async add(order: OrderJson): Promise<OrderJson> {
        this.logger.log(`Create new order`, order);

        BadRequestError.throwIf(order.getOrderLines().length == 0, `Order cannot have empty order lines`);
        BadRequestError.throwIf(
            order.getOrderStatus() != OrderStatusEnum.CONFIRMED,
            `Wrong order status ${statusToString(order.getOrderStatus())}`
        );

        const orderData: any = await this.prisma.order.create({
            data: {
                companyId: order.getCompanyId(),
                orderType: order.getOrderType(),
                orderStatus: order.getOrderStatus(),
                totalPrice: order.getTotalPrice(),
                date: order.getDate(),
                inventoryUpdated: false,
                expenseUpdated: false,
            }
        });

        this.logger.log(`Created order with [id: ${orderData.id}]`);

        return OrderJson.fromObjectAndLines(
            orderData,
            await this.orderLineService.addList(order.getOrderLines(), orderData.id)
        );
    };

    async update(order: OrderJson, orderId: number): Promise<OrderJson> {
        this.logger.log(`Update order status of order with [id=${orderId}]`);
        BadRequestError.throwIf(order.getId() != orderId, `Order id mismatch`);

        const existingOrder = await this.getById(orderId);

        BadRequestError.throwIf(
            order.getOrderStatus() < existingOrder.getOrderStatus(),
            `Expecting [status > ${existingOrder.getOrderStatus()}], but got [status > ${order.getOrderStatus()}]`
        )

        this.logger.log(`Update existing order:`, existingOrder);
        this.logger.log(`updated order:`, order);

        if (existingOrder.getOrderStatus() === OrderStatusEnum.CONFIRMED) {
            this.logger.log(`Deleting order lines for order with [id=${orderId}]`);
            await this.orderLineService.deleteByOrderId(orderId);

            await this.prisma.order.update({
                where: { id: orderId },
                data: {
                    companyId: order.getCompanyId(),
                    orderType: order.getOrderType(),
                    orderStatus: order.getOrderStatus(),
                    totalPrice: order.getTotalPrice(),
                    date: order.getDate(),
                    inventoryUpdated: false,
                    expenseUpdated: false,
                }
            });

            this.logger.log(`Adding order lines for order with [id=${orderId}]`);
            await this.orderLineService.addList(order.getOrderLines(), orderId)
        } else {
            await this.prisma.order.update({
                where: { id: orderId },
                data: {
                    companyId: existingOrder.getCompanyId(),
                    orderType: existingOrder.getOrderType(),
                    orderStatus: order.getOrderStatus(),
                    totalPrice: existingOrder.getTotalPrice(),
                    date: existingOrder.getDate(),
                    inventoryUpdated: existingOrder.isInventoryUpdated(),
                    expenseUpdated: existingOrder.isExpenseUpdated(),
                }
            });
        }

        return await this.getById(orderId);
    }

    async updateInventory(orderId: number): Promise<void> {
        const existingOrder = await this.getById(orderId);
        if (existingOrder.getOrderType() === OrderTypeEnum.BUY) {
            this.logger.log(`Increasing product quantity for new BUY order`);
            await this.adjustProductQuantities(existingOrder.getOrderLines(), +1);
        } else {
            this.logger.log(`Decreasing product quantity for new SELL order`);
            await this.adjustProductQuantities(existingOrder.getOrderLines(), -1);
        }

        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                companyId: existingOrder.getCompanyId(),
                orderType: existingOrder.getOrderType(),
                orderStatus: existingOrder.getOrderStatus(),
                totalPrice: existingOrder.getTotalPrice(),
                date: existingOrder.getDate(),
                inventoryUpdated: true,
                expenseUpdated: existingOrder.isExpenseUpdated(),
            }
        });
    }

    async updateExpense(orderId: number): Promise<void> {
        const existingOrder = await this.getById(orderId);

        if (existingOrder.getOrderType() === OrderTypeEnum.BUY) {
            this.logger.log(`Adding Expense for BUY order`);
            await this.expenseService.add(new ExpenseJson(
                0,
                `Commande Achats [${existingOrder.getId()}]`,
                existingOrder.getTotalPrice(),
                existingOrder.getDate(),
                existingOrder.getId(),
                true,
                false
            ));

            await this.prisma.order.update({
                where: { id: orderId },
                data: {
                    companyId: existingOrder.getCompanyId(),
                    orderType: existingOrder.getOrderType(),
                    orderStatus: existingOrder.getOrderStatus(),
                    totalPrice: existingOrder.getTotalPrice(),
                    date: existingOrder.getDate(),
                    inventoryUpdated: existingOrder.isInventoryUpdated(),
                    expenseUpdated: true,
                }
            });
        }
    }

    async cancelAllSync(orderId: number): Promise<void> {
        const existingOrder = await this.getById(orderId);

        if(existingOrder.isInventoryUpdated()) {
            this.logger.log(`Cancelling inventory updates`);
            if (existingOrder.getOrderType() === OrderTypeEnum.BUY) {
                this.logger.log(`Decreasing product quantity for BUY order`);
                await this.adjustProductQuantities(existingOrder.getOrderLines(), -1);
            } else {
                this.logger.log(`Increasing product quantity for SELL order`);
                await this.adjustProductQuantities(existingOrder.getOrderLines(), +1);
            }
        }

        if (existingOrder.isExpenseUpdated()) {
            if (existingOrder.getOrderType() === OrderTypeEnum.BUY) {
                this.logger.log(`Cancelling expense updates`);
                await this.expenseService.deleteByOrderId(existingOrder.getId());
            }
        }

        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                companyId: existingOrder.getCompanyId(),
                orderType: existingOrder.getOrderType(),
                orderStatus: existingOrder.getOrderStatus(),
                totalPrice: existingOrder.getTotalPrice(),
                date: existingOrder.getDate(),
                inventoryUpdated: false,
                expenseUpdated: false,
            }
        });
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete order with [id=${id}]`);
        const existingOrder = await this.getById(id);

        BadRequestError.throwIf(
            existingOrder.getOrderStatus() > OrderStatusEnum.CONFIRMED,
            `Order with [status=${statusToString(existingOrder.getOrderStatus())}] cannot be deleted`
        );

        this.logger.log(`Deleting order lines`);
        await this.orderLineService.deleteByOrderId(id);

        this.logger.log(`Deleting order`);
        await this.prisma.order.delete({where: { id }});
    }

    private async adjustProductQuantities(orderLines: OrderLineJson[], direction: 1 | -1): Promise<void> {
        const itemsToProcess = orderLines.flatMap(ol => {
            const items = [];

            if (ol.getQuantity() > 0) {
                items.push({ productVariationId: ol.getProductVariationId(), diff: ol.getQuantity() * direction });
            }

            ol.getOrderLineConsumedVariations()
                .filter(olv => olv.getQuantity() > 0)
                .forEach(olv => {
                    items.push({ productVariationId: olv.getProductVariationId(), diff: olv.getQuantity() * direction });
                });

            return items;
        });

        await Promise.all(itemsToProcess.map(async item => {
            this.logger.log(`${direction > 0 ? "Increasing" : "Decreasing"} quantity of product [id=${item.productVariationId}] by [${item.diff}]`);
            await this.productVariationService.updateQuantity(item.productVariationId, item.diff);
        }));
    }
}