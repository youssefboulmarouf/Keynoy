import {BaseService} from "../utilities/BaseService";
import {SupplierJson} from "./SupplierJson";
import AppError from "../utilities/AppError";

export class SupplierService extends BaseService {
    constructor() {
        super(SupplierService.name);
    }

    async get(): Promise<SupplierJson[]> {
        this.logger.log(`Get all suppliers`);
        const data = await this.prisma.supplier.findMany();
        return data.map((c: any) => SupplierJson.from(c));
    }

    async getById(supplierId: number): Promise<SupplierJson> {
        this.logger.log(`Get supplier by [id:${supplierId}]`);

        const supplierData = await this.prisma.supplier.findUnique({
            where: { id: supplierId }
        });

        if (!supplierData) {
            throw new AppError("Not Found", 404, `Supplier with [id:${supplierId}] not found`);
        }

        return SupplierJson.from(supplierData);
    }

    async add(supplier: SupplierJson): Promise<SupplierJson> {
        this.logger.log(`Create supplier customer`, supplier);
        return SupplierJson.from(
            await this.prisma.supplier.create({
                data: {
                    name: supplier.getName()
                }
            })
        );
    }

    async update(supplierId: number, supplier: any): Promise<SupplierJson> {
        this.logger.log(`Update supplier with [id=${supplierId}]`);

        if (supplierId != supplier.getId()) {
            throw new AppError("Bad Request", 400, `Supplier id mismatch`);
        }

        const existingSupplier = this.getById(supplierId);

        this.logger.log(`Update existing supplier`, existingSupplier);
        this.logger.log(`Supplier updated data`, supplier);

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
        this.logger.log(`Delete supplier with [id=${supplierId}]`);

        await this.prisma.supplier.delete({
            where: { id: supplierId }
        });
    }

}
