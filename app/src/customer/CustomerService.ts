import {BaseService} from "../utilities/BaseService";
import {CustomerJson} from "./CustomerJson";
import AppError from "../utilities/AppError";

export class CustomerService extends BaseService {

    constructor() {
        super(CustomerService.name);
    }

    async get(): Promise<CustomerJson[]> {
        this.logger.log(`Get all customers`);
        const data = await this.prisma.customer.findMany();
        return data.map((c: any) => CustomerJson.from(c));
    };

    async getById(customerId: number): Promise<CustomerJson> {
        this.logger.log(`Get customer by [id:${customerId}]`);
        const customerData = await this.prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customerData) {
            throw new AppError("Not Found", 404, `Customer with [id:${customerId}] not found`);
        }

        return CustomerJson.from(customerData);
    };

    async add(customer: CustomerJson): Promise<CustomerJson> {
        this.logger.log(`Create new customer`, customer);
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
        this.logger.log(`Update customer with [id=${customerId}]`);

        if (customerId != customer.getId()) {
            throw new AppError("Bad Request", 400, `Customer id mismatch`);
        }

        const existingCustomer = this.getById(customerId);

        this.logger.log(`Update existing customer`, existingCustomer);
        this.logger.log(`Customer updated data`, customer);

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
        this.logger.log(`Delete customer with [id=${customerId}]`);

        await this.prisma.customer.delete({
            where: { id: customerId }
        });
    }
}