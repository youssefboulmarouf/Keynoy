import {BaseService} from "../../utilities/BaseService";
import {ProductTypeJson} from "./ProductTypeJson";
import AppError from "../../utilities/AppError";

export class ProductTypeService extends BaseService {
    constructor() {
        super(ProductTypeService.name);
    }

    async get(): Promise<ProductTypeJson[]> {
        this.logger.log(`Get all product types`);
        const data = await this.prisma.productType.findMany();
        return data.map((c: any) => ProductTypeJson.from(c));
    }

    async getById(productTypeId: number): Promise<ProductTypeJson> {
        this.logger.log(`Get product type by [id:${productTypeId}]`);

        const productTypeData = await this.prisma.productType.findUnique({
            where: { id: productTypeId }
        });

        if (!productTypeId) {
            throw new AppError("Not Found", 404, `Product type with [id:${productTypeId}] not found`);
        }

        return ProductTypeJson.from(productTypeData);
    }

    async add(productType: ProductTypeJson): Promise<ProductTypeJson> {
        this.logger.log(`Create new product type`, productType);
        return ProductTypeJson.from(
            await this.prisma.productType.create({
                data: {
                    name: productType.getName()
                }
            })
        );
    }

    async update(productTypeId: number, productType: any): Promise<ProductTypeJson> {
        this.logger.log(`Update product type with [id=${productTypeId}]`);

        if (productTypeId != productType.getId()) {
            throw new AppError("Bad Request", 400, `Product type id mismatch`);
        }

        const existingPt = this.getById(productTypeId);

        this.logger.log(`Update existing product type`, existingPt);
        this.logger.log(`Product type updated data`, productType);

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
        this.logger.log(`Delete product type with [id=${productTypeId}]`);

        await this.prisma.productType.delete({
            where: { id: productTypeId }
        });
    }

}
