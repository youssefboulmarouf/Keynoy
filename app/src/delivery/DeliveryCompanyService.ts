import {BaseService} from "../utilities/BaseService";
import {DeliveryCompanyJson} from "./DeliveryCompanyJson";

export class DeliveryCompanyService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<DeliveryCompanyJson[]> {
        const data = await this.prisma.deliveryCompany.findMany();
        return data.map((c: any) => DeliveryCompanyJson.from(c));
    }

    async getById(deliveryCompanyId: number): Promise<DeliveryCompanyJson> {
        return DeliveryCompanyJson.from(
            await this.prisma.deliveryCompany.findUnique({ where: { id: deliveryCompanyId } })
        );
    }

    async add(deliveryCompany: DeliveryCompanyJson): Promise<DeliveryCompanyJson> {
        return DeliveryCompanyJson.from(
            await this.prisma.deliveryCompany.create({
                data: {
                    name: deliveryCompany.getName()
                }
            })
        );
    }

    async update(deliveryCompanyId: number, deliveryCompany: any): Promise<DeliveryCompanyJson> {
        return DeliveryCompanyJson.from(
            await this.prisma.deliveryCompany.update({
                where: { id: deliveryCompanyId },
                data: {
                    name: deliveryCompany.getName()
                }
            })
        );
    }

    async delete(deliveryCompanyId: number): Promise<void> {
        await this.prisma.deliveryCompany.delete({
            where: { id: deliveryCompanyId }
        });    }

}
