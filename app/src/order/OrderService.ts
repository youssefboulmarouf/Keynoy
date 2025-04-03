import {BaseService} from "../utilities/BaseService";
import {OrderJson} from "./OrderJson";
import {OrderTypeEnum} from "./OrderTypeEnum";
import {OrderStatusEnum, statusToString} from "./OrderStatusEnum";
import {OrderLineJson} from "./OrderLineJson";
import {OrderLineService} from "./OrderLineService";
import {ExpenseService} from "../expense/ExpenseService";
import {ExpenseJson} from "../expense/ExpenseJson";
import {ProductService} from "../product/ProductService";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";

export class OrderService extends BaseService {
    private readonly orderLineService: OrderLineService;
    private readonly expenseService: ExpenseService;
    private readonly productService: ProductService;

    constructor() {
        super(OrderService.name);
        this.orderLineService = new OrderLineService();
        this.expenseService = new ExpenseService();
        this.productService = new ProductService();
    }

    async get(): Promise<OrderJson[]> {
        this.logger.log(`Get all orders`);
        const prismaOrders = await this.prisma.order.findMany();

        const allOrders: OrderJson[] = [];
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
        this.logger.log(`Get order by [id:${orderId}]`);
        const orderData = await this.prisma.order.findUnique({
            where: { id: orderId }
        });

        NotFoundError.throwIf(!orderData, `Order with [id:${orderId}] not found`);

        return OrderJson.fromDb(
            orderData,
            await this.orderLineService.getById(orderId)
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
                customerId: order.getCustomerId(),
                supplierId: order.getSupplierId(),
                orderType: order.getOrderType(),
                orderStatus: order.getOrderStatus(),
                totalPrice: order.getTotalPrice(),
                date: order.getDate()
            }
        });

        this.logger.log(`Created order with [id: ${orderData.id}]`);

        const savedOrder = OrderJson.fromDb(
            orderData,
            await this.orderLineService.addList(order.getOrderLines(), orderData.id)
        );

        await this.updateProductAndExpense(savedOrder);

        return savedOrder;
    };

    async update(orderId: number, orderStatus: OrderStatusEnum): Promise<void> {
        this.logger.log(`Update order status of order with [id=${orderId}]`);

        const existingOrder = await this.getById(orderId);
        BadRequestError.throwIf(
            orderStatus < existingOrder.getOrderStatus(),
            `Order already have status ${statusToString(existingOrder.getOrderStatus())}`
        );
        BadRequestError.throwIf(
            orderStatus > OrderStatusEnum.FINISHED,
            `Wrong order status ${statusToString(orderStatus)}`
        );

        this.logger.log(`Update existing order`, existingOrder);
        this.logger.log(`New order status:`, statusToString(orderStatus));

        await this.prisma.order.update({
            where: { id: orderId },
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

    async delete(orderId: number): Promise<void> {
        this.logger.log(`Delete order with [id=${orderId}]`);
        const existingOrder = await this.getById(orderId);
        BadRequestError.throwIf(
            existingOrder.getOrderStatus() != OrderStatusEnum.CONFIRMED,
            `Order with [status=${existingOrder.getOrderStatus()}] cannot be deleted`
        );

        this.logger.log(`Order status is confirmed, order and related entities will be deleted`);
        await this.reverseProductAndExpenseUpdates(existingOrder);

        this.logger.log(`Deleting order lines`);
        await this.orderLineService.delete(orderId);

        this.logger.log(`Deleting order`);
        await this.prisma.order.delete({
            where: { id: orderId }
        });
    }

    private async updateProductAndExpense(savedOrder: OrderJson) {
        if (savedOrder.getOrderType() === OrderTypeEnum.BUY) {
            this.logger.log(`Adding Expense for BUY order`);
            await this.expenseService.add(new ExpenseJson(
                0,
                "Buy Order",
                savedOrder.getTotalPrice(),
                savedOrder.getDate(),
                savedOrder.getId()
            ));

            this.logger.log(`Increasing product quantity for new BUY order`);
            await this.increaseProductQuantity(savedOrder.getOrderLines());
        } else if (savedOrder.getOrderType() === OrderTypeEnum.SELL) {
            this.logger.log(`Decreasing product quantity for new SELL order`);
            await this.decreaseProductQuantity(savedOrder.getOrderLines());
        }
    }

    private async reverseProductAndExpenseUpdates(existingOrder: OrderJson): Promise<void> {
        this.logger.log(`Order status is confirmed, products quantity will be updated`);

        if (existingOrder.getOrderType() === OrderTypeEnum.BUY) {
            this.logger.log(`Deleting expense for order by id=${existingOrder.getId()}`);
            await this.expenseService.deleteByOrderId(existingOrder.getId());

            this.logger.log(`Decreasing product quantity for updated BUY order`);
            await this.decreaseProductQuantity(existingOrder.getOrderLines());
        } else if (existingOrder.getOrderType() === OrderTypeEnum.SELL) {
            this.logger.log(`Increasing product quantity for updated SELL order`);
            await this.increaseProductQuantity(existingOrder.getOrderLines());
        }
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