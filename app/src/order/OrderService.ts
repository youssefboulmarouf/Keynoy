import {BaseService} from "../utilities/BaseService";
import {OrderJson} from "./OrderJson";
import {OrderTypeEnum} from "./OrderTypeEnum";
import {OrderStatusEnum} from "./OrderStatusEnum";
import {OrderLineJson} from "./OrderLineJson";
import {OrderLineService} from "./OrderLineService";
import {ExpenseService} from "../expense/ExpenseService";
import {ExpenseJson} from "../expense/ExpenseJson";
import {ProductService} from "../product/ProductService";

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
            await this.orderLineService.addList(order.getOrderLines())
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
        }

        return savedOrder
    };

    async update(orderId: number, order: OrderJson): Promise<OrderJson> {

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

        const savedOrderLines: OrderLineJson[] = []
        for (const line of order.getOrderLines()) {
            savedOrderLines.push(
                await this.orderLineService.add(line)
            )
        }

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

        return OrderJson.fromDb(prismaOrder, savedOrderLines);
    }

    async delete(orderId: number): Promise<void> {
        await this.orderLineService.delete(orderId);
        await this.prisma.order.delete({
            where: { id: orderId }
        });
    }
}