import {BaseService} from "../utilities/BaseService";
import {SupplierJson} from "./SupplierJson";

export class SupplierService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<SupplierJson[]> {
        const data = await this.prisma.supplier.findMany();
        return data.map((c: any) => SupplierJson.from(c));
    }

    async getById(supplierId: number): Promise<SupplierJson> {
        return SupplierJson.from(
            await this.prisma.supplier.findUnique({ where: { id: supplierId } })
        );
    }

    async add(supplier: SupplierJson): Promise<SupplierJson> {
        return SupplierJson.from(
            await this.prisma.supplier.create({
                data: {
                    name: supplier.getName()
                }
            })
        );
    }

    async update(supplierId: number, supplier: any): Promise<SupplierJson> {
        return SupplierJson.from(
            await this.prisma.supplier.update({
                where: { id: supplierId },
                data: {
                    name: supplier.getName()
                }
            })
        );
    }

    async delete(supplierId: number): Promise<void> {
        await this.prisma.supplier.delete({
            where: { id: supplierId }
        });
    }

}
