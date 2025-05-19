import {BaseService} from "../../utilities/BaseService";
import {OrderLineJson} from "./OrderLineJson";
import {OrderLineProductVariationService} from "./order-line-product-variation/OrderLineProductVariationService";

export class OrderLineService extends BaseService {
    private readonly orderLineProductVariationService: OrderLineProductVariationService;

    constructor() {
        super(OrderLineService.name);
        this.orderLineProductVariationService = new OrderLineProductVariationService();
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
                designId: orderLine.getDesignId()
            }
        });

        this.logger.log(`Created order line with [id: ${orderLineData.id}]`);

        const orderLineProductVariations = await this.orderLineProductVariationService.addList(
            orderId,
            orderLineData.id,
            orderLine.getOrderLineProductVariations()
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