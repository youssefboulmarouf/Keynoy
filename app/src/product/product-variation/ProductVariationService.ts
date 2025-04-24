import {BaseService} from "../../utilities/BaseService";
import {ProductVariationJson} from "./ProductVariationJson";
import NotFoundError from "../../utilities/errors/NotFoundError";
import BadRequestError from "../../utilities/errors/BadRequestError";
import {ColorService} from "../../color/ColorService";

export class ProductVariationService extends BaseService {
    private readonly colorService: ColorService;
    constructor() {
        super(ProductVariationService.name);
        this.colorService = new ColorService();
    }

    async get(): Promise<ProductVariationJson[]> {
        this.logger.log(`Get all product variations`);
        const pvData = await this.prisma.productVariation.findMany();
        return await Promise.all(
            pvData.map(async variant =>
                ProductVariationJson.fromObjectAndColor(
                    variant,
                    await this.colorService.getById(variant.colorId)
                )
            )
        );
    }

    async getById(id: number): Promise<ProductVariationJson> {
        this.logger.log(`Get product variation by [id:${id}]`);
        const pvData = await this.prisma.productVariation.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!pvData, `Product variation with [id:${id}] not found`);

        return ProductVariationJson.fromObjectAndColor(
            pvData,
            await this.colorService.getById(pvData?.colorId ?? 0)
        );
    }

    async getByProductId(productId: number): Promise<ProductVariationJson[]> {
        this.logger.log(`Get product variation by [productId:${productId}]`);
        const pvData = await this.prisma.productVariation.findMany({
            where: { productId }
        });

        return await Promise.all(
            pvData.map(async variant =>
                ProductVariationJson.fromObjectAndColor(
                    variant,
                    await this.colorService.getById(variant.colorId)
                )
            )
        );
    }

    async add(productVariation: ProductVariationJson): Promise<ProductVariationJson> {
        this.logger.log(`Create new product variation`, productVariation);
        return ProductVariationJson.fromObjectAndColor(
            await this.prisma.productVariation.create({
                data: {
                    productId: productVariation.getProductId(),
                    colorId: productVariation.getColor().getId(),
                    size: productVariation.getSize(),
                    quantity: productVariation.getQuantity(),
                    threshold: productVariation.getThreshold(),
                }
            }),
            await this.colorService.getById(productVariation.getColor().getId())
        );
    }

    async addMany(productVariations: ProductVariationJson[], productId: number): Promise<ProductVariationJson[]> {
        this.logger.log(`Create new products variation`, productVariations);

        await this.prisma.productVariation.createMany({
            data: productVariations.map(pv => ({
                productId: productId,
                colorId: pv.getColor().getId(),
                size: pv.getSize(),
                quantity: pv.getQuantity(),
                threshold: pv.getThreshold(),
            }))
        })

        return this.getByProductId(productId);
    }

    async update(id: number, productVariation: ProductVariationJson): Promise<ProductVariationJson> {
        this.logger.log(`Update product variation with [id=${id}]`);

        BadRequestError.throwIf(id != productVariation.getId(), `Product variation id mismatch`);

        const existingPv = await this.getById(id);

        this.logger.log(`Update existing product variation`, existingPv);
        this.logger.log(`Product variation updated data`, productVariation);

        return ProductVariationJson.fromObjectAndColor(
            await this.prisma.productVariation.update({
                where: { id },
                data: {
                    productId: productVariation.getProductId(),
                    colorId: productVariation.getColor().getId(),
                    size: productVariation.getSize(),
                    quantity: productVariation.getQuantity(),
                    threshold: productVariation.getThreshold(),
                }
            }),
            await this.colorService.getById(productVariation.getColor().getId())
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
}