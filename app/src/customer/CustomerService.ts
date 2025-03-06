import {BaseService} from "../utilities/BaseService";
import {CustomerJson} from "./CustomerJson";

export class CustomerService extends BaseService {
    constructor() {
        super();
    }

    public get = async (): Promise<CustomerJson[]> => {
        const data = await this.prisma.customer.findMany();
        return data.map((c: any) => CustomerJson.from(c));
    };

    public getById = async (customerId: number): Promise<CustomerJson> => {
        return CustomerJson.from(
            await this.prisma.customer.findUnique({ where: { id: customerId } })
        );
    };

    public add = async (customer: CustomerJson): Promise<CustomerJson> => {
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

    public update = async (customerId: number, customer: any): Promise<CustomerJson> => {
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

    public delete = async (customerId: number) => {
        await this.prisma.customer.delete({
            where: { id: customerId }
        });
    }
}