import {BaseService} from "../../utilities/BaseService";
import {ProductVariationJson} from "./ProductVariationJson";
import NotFoundError from "../../utilities/errors/NotFoundError";
import BadRequestError from "../../utilities/errors/BadRequestError";

export class ProductVariationService extends BaseService {
    constructor() {
        super(ProductVariationService.name);
    }

    async get(): Promise<ProductVariationJson[]> {
        this.logger.log(`Get all product variations`);
        return (await this.prisma.productVariation.findMany()).map(ProductVariationJson.fromObject);

    }

    async getById(id: number): Promise<ProductVariationJson> {
        this.logger.log(`Get product variation by [id:${id}]`);
        const pvData = await this.prisma.productVariation.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!pvData, `Product variation with [id:${id}] not found`);

        return ProductVariationJson.fromObject(pvData);
    }

    async add(productVariation: ProductVariationJson): Promise<ProductVariationJson> {
        this.logger.log(`Create new product variation`, productVariation);
        return ProductVariationJson.fromObject(
            await this.prisma.productVariation.create({
                data: {
                    productId: productVariation.getProductId(),
                    colorId: productVariation.getColorId(),
                    name: productVariation.getName(),
                    size: productVariation.getSize(),
                    quantity: productVariation.getQuantity(),
                    threshold: productVariation.getThreshold(),
                }
            })
        );
    }

    async update(id: number, productVariation: ProductVariationJson): Promise<ProductVariationJson> {
        this.logger.log(`Update product variation with [id=${id}]`);

        BadRequestError.throwIf(id != productVariation.getId(), `Product variation id mismatch`);

        const existingPv = await this.getById(id);

        this.logger.log(`Update existing product variation`, existingPv);
        this.logger.log(`Product variation updated data`, productVariation);

        return ProductVariationJson.fromObject(
            await this.prisma.productVariation.update({
                where: { id },
                data: {
                    productId: productVariation.getProductId(),
                    colorId: productVariation.getColorId(),
                    size: productVariation.getSize(),
                    name: productVariation.getName(),
                    quantity: productVariation.getQuantity(),
                    threshold: productVariation.getThreshold(),
                }
            })
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete product variation with [id=${id}]`);
        await this.prisma.productVariation.delete({
            where: { id }
        });
    }

    async deleteByProductId(productId: number): Promise<void> {
        this.logger.log(`Delete product variation with [productId=${productId}]`);
        await this.prisma.productVariation.deleteMany({
            where: { productId }
        });
    }

    async updateQuantity(id: number, quantityDiff: number): Promise<void> {
        this.logger.log(`Update product quantity [id=${id}, diff=${quantityDiff}]`);

        await this.prisma.productVariation.update({
            where: { id },
            data: {
                quantity: { increment: quantityDiff }
            }
        });
    }
}