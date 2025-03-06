import {BaseService} from "../../utilities/BaseService";
import {ProductTypeJson} from "./ProductTypeJson";

export class ProductTypeService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<ProductTypeJson[]> {
        const data = await this.prisma.productType.findMany();
        return data.map((c: any) => ProductTypeJson.from(c));
    }

    async getById(productTypeId: number): Promise<ProductTypeJson> {
        return ProductTypeJson.from(
            await this.prisma.productType.findUnique({ where: { id: productTypeId } })
        );
    }

    async add(productType: ProductTypeJson): Promise<ProductTypeJson> {
        return ProductTypeJson.from(
            await this.prisma.productType.create({
                data: {
                    name: productType.getName()
                }
            })
        );
    }

    async update(productTypeId: number, productType: any): Promise<ProductTypeJson> {
        return ProductTypeJson.from(
            await this.prisma.productType.update({
                where: { id: productTypeId },
                data: {
                    name: productType.getName()
                }
            })
        );
    }

    async delete(productTypeId: number): Promise<void> {
        await this.prisma.productType.delete({
            where: { id: productTypeId }
        });
    }

}
