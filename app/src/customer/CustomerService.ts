import {BaseService} from "../utilities/BaseService";
import {CustomerJson} from "./CustomerJson";

export class CustomerService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<CustomerJson[]> {
        const data = await this.prisma.customer.findMany();
        return data.map((c: any) => CustomerJson.from(c));
    };

    async getById(customerId: number): Promise<CustomerJson> {
        return CustomerJson.from(
            await this.prisma.customer.findUnique({
                    where: { id: customerId }
            })
        );
    };

    async add(customer: CustomerJson): Promise<CustomerJson> {
        return CustomerJson.from(
            await this.prisma.customer.create({
                data: {
                    name: customer.getName(),
                    phone: customer.getPhone(),
                    location: customer.getLocation()
                }
            })
        );
    };

    async update(customerId: number, customer: any): Promise<CustomerJson> {
        return CustomerJson.from(
            await this.prisma.customer.update({
                where: { id: customerId },
                data: {
                    name: customer.getName(),
                    phone: customer.getPhone(),
                    location: customer.getLocation()
                }
            })
        );
    }

    async delete(customerId: number): Promise<void> {
        await this.prisma.customer.delete({
            where: { id: customerId }
        });
    }
}