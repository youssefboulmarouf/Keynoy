import {BaseService} from "../utilities/BaseService";
import {DeliveryCompanyJson} from "./DeliveryCompanyJson";
import AppError from "../utilities/AppError";

export class DeliveryCompanyService extends BaseService {
    constructor() {
        super(DeliveryCompanyService.name);
    }

    async get(): Promise<DeliveryCompanyJson[]> {
        this.logger.log(`Get all delivery companies`);
        const data = await this.prisma.deliveryCompany.findMany();
        return data.map((c: any) => DeliveryCompanyJson.from(c));
    }

    async getById(deliveryCompanyId: number): Promise<DeliveryCompanyJson> {
        this.logger.log(`Get all delivery company by [id: ${deliveryCompanyId}]`);

        const dcData = await this.prisma.deliveryCompany.findUnique({
            where: { id: deliveryCompanyId }
        });

        if (!dcData) {
            throw new AppError("Not Found", 404, `Delivery Company with [id:${deliveryCompanyId}] not found`);
        }

        return DeliveryCompanyJson.from(dcData);
    }

    async add(deliveryCompany: DeliveryCompanyJson): Promise<DeliveryCompanyJson> {
        this.logger.log(`Create new delivery company`, deliveryCompany);
        return DeliveryCompanyJson.from(
            await this.prisma.deliveryCompany.create({
                data: {
                    name: deliveryCompany.getName()
                }
            })
        );
    }

    async update(deliveryCompanyId: number, deliveryCompany: any): Promise<DeliveryCompanyJson> {
        this.logger.log(`Update delivery company by [id: ${deliveryCompanyId}]`);

        if (deliveryCompanyId != deliveryCompany.getId()) {
            throw new AppError("Bad Request", 400, `Delivery Company id mismatch`);
        }

        const existingDc = this.getById(deliveryCompanyId);

        this.logger.log(`Update existing delivery company`, existingDc);
        this.logger.log(`Delivery company updated data`, deliveryCompany);

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
        this.logger.log(`Delete delivery company with [id=${deliveryCompanyId}]`);

        await this.prisma.deliveryCompany.delete({
            where: { id: deliveryCompanyId }
        });
    }

}
