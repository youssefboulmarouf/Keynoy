import {BaseService} from "../../../utilities/BaseService";
import {OrderLineProductVariationJson} from "./OrderLineProductVariationJson";

export class OrderLineProductVariationService extends BaseService {

    constructor() {
        super(OrderLineProductVariationService.name);
    }

    async addList(orderId: number, orderLineId: number, orderLineProductVariations: OrderLineProductVariationJson[]): Promise<OrderLineProductVariationJson[]> {
        this.logger.log(`Create multiple order line product variation`, orderLineProductVariations);

        await this.prisma.orderLineProductVariation.createMany({
            data: orderLineProductVariations.map(o => ({
                orderLineId,
                productVariationId: o.getProductVariationId(),
                quantity: o.getQuantity(),
                unitPrice: o.getUnitPrice(),
            })),
        })

        return await this.getByOrderLineId(orderId, orderLineId);
    };

    async getByOrderLineId(orderId: number, orderLineId: number): Promise<OrderLineProductVariationJson[]> {
        this.logger.log(`Get order line products variations by [orderLineId=${orderLineId}] for order with [id=${orderId}]`);

        const data = await this.prisma.orderLineProductVariation.findMany({
            where: { orderLineId }
        })

        return data.map(OrderLineProductVariationJson.fromObject);
    }

    async deleteByOrderLineId(orderId: number, orderLineId: number): Promise<void> {
        this.logger.log(`Deleting order line products variations by [orderLineId=${orderLineId}] for order with [id=${orderId}]`);

        await this.prisma.orderLineProductVariation.deleteMany({
            where: { orderLineId }
        })
    }
}