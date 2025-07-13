import {BaseService} from "../../utilities/BaseService";
import {OrderLineJson} from "./OrderLineJson";
import {OrderLineConsumedVariationService} from "./order-line-product-variation/OrderLineConsumedVariationService";

export class OrderLineService extends BaseService {
    private readonly orderLineProductVariationService: OrderLineConsumedVariationService;

    constructor() {
        super(OrderLineService.name);
        this.orderLineProductVariationService = new OrderLineConsumedVariationService();
    }

    async getByOrderId(orderId: number): Promise<OrderLineJson[]> {
        this.logger.log(`Get order lines by [orderId: ${orderId}]`);
        const lines = await this.prisma.orderLine.findMany({where: { orderId }});
        return await Promise.all(lines.map(async line =>
            OrderLineJson.fromObjectAndVariations(
                line,
                await this.orderLineProductVariationService.getByOrderLineId(orderId, line.id)
            )
        ));
    }

    async add(orderLine: OrderLineJson, orderId: number): Promise<OrderLineJson> {
        this.logger.log(`Create new order line`, orderLine);

        const orderLineData = await this.prisma.orderLine.create({
            data: {
                orderId,
                designId: orderLine.getDesignId(),
                productVariationId: orderLine.getProductVariationId(),
                quantity: orderLine.getQuantity(),
                unitPrice: orderLine.getUnitPrice(),
            }
        });

        this.logger.log(`Created order line with [id: ${orderLineData.id}]`);

        const orderLineProductVariations = await this.orderLineProductVariationService.addList(
            orderId,
            orderLineData.id,
            orderLine.getOrderLineConsumedVariations()
        );

        return OrderLineJson.fromObjectAndVariations(orderLineData, orderLineProductVariations);
    };

    async addList(orderLines: OrderLineJson[], orderId: number): Promise<OrderLineJson[]> {
        this.logger.log(`Create multiple order lines`);
        const savedOrderLines: OrderLineJson[] = [];

        await Promise.all(orderLines.map(async (orderLine) =>
            savedOrderLines.push(await this.add(orderLine, orderId))
        ))

        return savedOrderLines;
    };

    async deleteByOrderId(orderId: number): Promise<void> {
        this.logger.log(`Delete all order lines by [orderId:${orderId}]`);
        const orderLines = await this.getByOrderId(orderId);

        await Promise.all(
            orderLines.map(async ol => {
                await this.orderLineProductVariationService.deleteByOrderLineId(orderId, ol.getId())
            })
        );

        await this.prisma.orderLine.deleteMany({
            where: { orderId }
        });
    }

}