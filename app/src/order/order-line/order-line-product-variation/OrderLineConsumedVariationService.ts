import {BaseService} from "../../../utilities/BaseService";
import {OrderLineConsumedVariationJson} from "./OrderLineConsumedVariationJson";

export class OrderLineConsumedVariationService extends BaseService {

    constructor() {
        super(OrderLineConsumedVariationService.name);
    }

    async addList(orderId: number, orderLineId: number, orderLineProductVariations: OrderLineConsumedVariationJson[]): Promise<OrderLineConsumedVariationJson[]> {
        this.logger.log(`Create multiple order line product variation`, orderLineProductVariations);

        await this.prisma.orderLineConsumedVariation.createMany({
            data: orderLineProductVariations.map(o => ({
                orderLineId,
                productVariationId: o.getProductVariationId(),
                quantity: o.getQuantity(),
                finalQuantity: o.getFinalQuantity()
            })),
        })

        return await this.getByOrderLineId(orderId, orderLineId);
    };

    async getByOrderLineId(orderId: number, orderLineId: number): Promise<OrderLineConsumedVariationJson[]> {
        this.logger.log(`Get order line products variations by [orderLineId=${orderLineId}] for order with [id=${orderId}]`);

        const data = await this.prisma.orderLineConsumedVariation.findMany({
            where: { orderLineId }
        })

        return data.map(OrderLineConsumedVariationJson.fromObject);
    }

    async deleteByOrderLineId(orderId: number, orderLineId: number): Promise<void> {
        this.logger.log(`Deleting order line products variations by [orderLineId=${orderLineId}] for order with [id=${orderId}]`);

        await this.prisma.orderLineConsumedVariation.deleteMany({
            where: { orderLineId }
        })
    }
}