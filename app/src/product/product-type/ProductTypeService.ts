import {BaseService} from "../../utilities/BaseService";
import {ProductTypeJson} from "./ProductTypeJson";
import NotFoundError from "../../utilities/errors/NotFoundError";
import BadRequestError from "../../utilities/errors/BadRequestError";

export class ProductTypeService extends BaseService {
    constructor() {
        super(ProductTypeService.name);
    }

    async get(): Promise<ProductTypeJson[]> {
        this.logger.log(`Get all product types`);
        const data = await this.prisma.productType.findMany();
        return data.map(c => ProductTypeJson.from(c));
    }

    async getById(id: number): Promise<ProductTypeJson> {
        this.logger.log(`Get product type by [id:${id}]`);

        const productTypeData = await this.prisma.productType.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!productTypeData, `Product type with [id:${id}] not found`);

        return ProductTypeJson.from(productTypeData);
    }

    async add(productType: ProductTypeJson): Promise<ProductTypeJson> {
        this.logger.log(`Create new product type`, productType);
        return ProductTypeJson.from(
            await this.prisma.productType.create({
                data: {
                    name: productType.getName(),
                    sellable: productType.isSellable()
                }
            })
        );
    }

    async update(id: number, productType: ProductTypeJson): Promise<ProductTypeJson> {
        this.logger.log(`Update product type with [id=${id}]`);

        BadRequestError.throwIf(id != productType.getId(), `Product type id mismatch`);

        const existingPt = await this.getById(id);

        this.logger.log(`Update existing product type`, existingPt);
        this.logger.log(`Product type updated data`, productType);

        return ProductTypeJson.from(
            await this.prisma.productType.update({
                where: { id },
                data: {
                    name: productType.getName(),
                    sellable: productType.isSellable()
                }
            })
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete product type with [id=${id}]`);

        await this.prisma.productType.delete({
            where: { id: id }
        });
    }
}
