import {BaseService} from "../utilities/BaseService";
import {OrderJson} from "./OrderJson";
import {OrderTypeEnum} from "./OrderTypeEnum";
import {OrderStatusEnum} from "./OrderStatusEnum";
import {OrderLineJson} from "./OrderLineJson";
import {OrderLineService} from "./OrderLineService";
import {ExpenseService} from "../expense/ExpenseService";
import {ExpenseJson} from "../expense/ExpenseJson";
import {ProductService} from "../product/ProductService";
import Logger from "../utilities/Logger";
import {DeliveryJson} from "./DeliveryJson";

export class OrderService extends BaseService {
    private readonly orderLineService: OrderLineService;
    private readonly expenseService: ExpenseService;
    private readonly productService: ProductService;

    constructor() {
        super();
        this.orderLineService = new OrderLineService();
        this.expenseService = new ExpenseService();
        this.productService = new ProductService();
    }

    async get(): Promise<OrderJson[]> {
        const prismaOrders = await this.prisma.order.findMany();

        const allOrders: OrderJson[] = []
        for (const order of prismaOrders) {
            allOrders.push(
                OrderJson.fromDb(
                    order,
                    await this.orderLineService.getById(order.id)
                )
            )
        }
        return allOrders;
    };

    async getById(orderId: number): Promise<OrderJson> {
        const prismaOrder = await this.prisma.order.findUnique({
            where: { id: orderId }
        });

        return OrderJson.fromDb(
            prismaOrder,
            await this.orderLineService.getById(orderId)
        );
    };

    async add(order: OrderJson): Promise<OrderJson> {
        const prismaOrder: any = await this.prisma.order.create({
            data: {
                customerId: order.getCustomerId(),
                supplierId: order.getSupplierId(),
                orderType: order.getOrderType() == OrderTypeEnum.UNKNOWN ? '' : order.getOrderType(),
                orderStatus: order.getOrderStatus() == OrderStatusEnum.UNKNOWN ? '' : order.getOrderStatus(),
                totalPrice: order.getTotalPrice(),
                date: order.getDate()
            }
        });

        const savedOrder = OrderJson.fromDb(
            prismaOrder,
            await this.orderLineService.addList(order.getOrderLines(), prismaOrder.id)
        );
        
        if (savedOrder.getOrderType() === OrderTypeEnum.BUY) {
            await this.expenseService.add(new ExpenseJson(
                0,
                "Buy Order",
                savedOrder.getTotalPrice(),
                savedOrder.getDate(),
                savedOrder.getId(),
                0
            ));

            this.logger.log(`Increasing product quantity for new BUY order`);
            await this.increaseProductQuantity(savedOrder.getOrderLines());
        } else if (savedOrder.getOrderType() === OrderTypeEnum.SELL) {
            this.logger.log(`Decreasing product quantity for new SELL order`);
            await this.decreaseProductQuantity(savedOrder.getOrderLines());
        }
        return savedOrder;
    };

    async update(orderId: number, order: OrderJson): Promise<OrderJson> {
        this.logger.log(`Update order with [id=${orderId}]`);
        const existingOrder = await this.getById(orderId);

        // TODO: add logic to increase/decrease products based on order status
            // Increase product quantity
            // for (const line of savedOrder.getOrderLines()) {
            //     await this.productService.updateQuantity(line.getProductId(), line.getQuantity());
            // }
            //
            // Decrease product quantity
            // for (const line of savedOrder.getOrderLines()) {
            //     await this.productService.updateQuantity(line.getProductId(), (-line.getQuantity()));
            // }
        // TODO: add logic for deliveries
        await this.orderLineService.delete(orderId);

        await this.updateProductQuantitiesMaybe(existingOrder);

        const prismaOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                customerId: order.getCustomerId(),
                supplierId: order.getSupplierId(),
                orderType: order.getOrderType() == OrderTypeEnum.UNKNOWN ? '' : order.getOrderType(),
                orderStatus: order.getOrderStatus() == OrderStatusEnum.UNKNOWN ? '' : order.getOrderStatus(),
                totalPrice: order.getTotalPrice(),
                date: order.getDate()
            }
        });

        const savedOrderLines: OrderLineJson[] = await this.updateOrderLinesMaybe(existingOrder);

        return OrderJson.fromDb(prismaOrder, savedOrderLines);
    }

    async delete(orderId: number): Promise<void> {
        this.logger.log(`Delete order with [id=${orderId}]`);
        const existingOrder = await this.getById(orderId);

        if (existingOrder.getOrderStatus() === OrderStatusEnum.CONFIRMED) {
            this.logger.log(`Order status is confirmed, order and related entities will be deleted`);
            if (existingOrder.getOrderType() === OrderTypeEnum.BUY) {
                this.logger.log(`Deleting Expense for BUY order`);
                await this.expenseService.deleteByOrderId(orderId);
            }

            await this.updateProductQuantitiesMaybe(existingOrder);

            this.logger.log(`Deleting order lines`);
            await this.orderLineService.delete(orderId);

            this.logger.log(`Deleting order`);
            await this.prisma.order.delete({
                where: { id: orderId }
            });
        } else {
            this.logger.log(`Order with [status=${existingOrder.getOrderStatus()}] doesn't allow deleting`);
        }

    }

    async shipped(deliveryJson: DeliveryJson) {
        this.logger.log(`Adding delivery details to order with [id=${deliveryJson.getOrderId()}]`);
        const existingOrder = await this.getById(deliveryJson.getOrderId());

        if (existingOrder.getOrderStatus() != OrderStatusEnum.SHIPPED || existingOrder.getOrderStatus() != OrderStatusEnum.DELIVERED) {
            this.logger.log(`Update order status to shipped`);
            await this.prisma.order.update({
                where: { id: existingOrder.getId() },
                data: {
                    customerId: existingOrder.getCustomerId(),
                    supplierId: existingOrder.getSupplierId(),
                    orderType: existingOrder.getOrderType() == OrderTypeEnum.UNKNOWN ? '' : existingOrder.getOrderType(),
                    orderStatus: OrderStatusEnum.SHIPPED,
                    totalPrice: existingOrder.getTotalPrice(),
                    date: existingOrder.getDate()
                }
            });

            await this.prisma.delivery.create({
                data: {
                    orderId: deliveryJson.getOrderId(),
                    dcId: deliveryJson.getDcId(),
                    shippingDate: deliveryJson.getShippingDate(),
                    deliveryDate: deliveryJson.getDeliveryDate(),
                    price: deliveryJson.getPrice()
                }
            });
        } else {
            this.logger.log(`Order with [id=${existingOrder.getId()}] already have [status=${existingOrder.getOrderStatus()}]`);
        }
    }

    private async updateProductQuantitiesMaybe(existingOrder: OrderJson): Promise<void> {
        if (existingOrder.getOrderStatus() === OrderStatusEnum.CONFIRMED) {
            this.logger.log(`Order status is confirmed, products quantity will be updated`);
            if (existingOrder.getOrderType() === OrderTypeEnum.BUY) {
                this.logger.log(`Decreasing product quantity for updated BUY order`);
                await this.decreaseProductQuantity(existingOrder.getOrderLines());
            } else if (existingOrder.getOrderType() === OrderTypeEnum.SELL) {
                this.logger.log(`Increasing product quantity for updated SELL order`);
                await this.increaseProductQuantity(existingOrder.getOrderLines());
            }
        } else {
            this.logger.log(`Order with [status=${existingOrder.getOrderStatus()}] doesn't allow updating product quantities`);
        }
    }

    private async updateOrderLinesMaybe(existingOrder: OrderJson): Promise<OrderLineJson[]> {
        let savedOrderLines: OrderLineJson[] = existingOrder.getOrderLines();

        if (existingOrder.getOrderStatus() === OrderStatusEnum.CONFIRMED) {
            this.logger.log(`Updating order lines`);
            await this.orderLineService.delete(existingOrder.getId());
            savedOrderLines = await this.orderLineService.addList(existingOrder.getOrderLines(), existingOrder.getId());
        } else {
            this.logger.log(`Order with [status=${existingOrder.getOrderStatus()}] doesn't allow updating oder lines`);
        }

        return savedOrderLines;
    }

    private async increaseProductQuantity(orderLines: OrderLineJson[]): Promise<void> {
        await Promise.all(
            orderLines.map(async (line) => {
                this.logger.log(`Increasing quantity of product with [id= ${line.getProductId()}] by [${line.getQuantity()}]`);
                await this.productService.updateQuantity(line.getProductId(), line.getQuantity());
            })
        )
    }

    private async decreaseProductQuantity(orderLines: OrderLineJson[]): Promise<void> {
        await Promise.all(
            orderLines.map(async (line) => {
                this.logger.log(`Decreasing quantity of product with [id= ${line.getProductId()}] by [${-line.getQuantity()}]`);
                await this.productService.updateQuantity(line.getProductId(), -line.getQuantity());
            })
        )
    }
}