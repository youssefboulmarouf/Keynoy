import {BaseService} from "../utilities/BaseService";
import {ProductJson} from "./ProductJson";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";
import {ColorJson} from "../color/ColorJson";
import {ColorService} from "../color/ColorService";

export class ProductService extends BaseService {
    private readonly colorService: ColorService;
    constructor() {
        super(ProductService.name);
        this.colorService = new ColorService();
    }

    async get(): Promise<ProductJson[]> {
        this.logger.log("Get all products");

        const products = await this.prisma.product.findMany();

        return await Promise.all(products.map(async (p) =>
            ProductJson.fromObjectAndColor(
                p,
                await this.colorService.getByProductId(p.id)
            )
        ));
    }

    async getById(id: number): Promise<ProductJson> {
        this.logger.log(`Get product by [id:${id}]`);

        const productData = await this.prisma.product.findUnique({
            where: { id }
        });
        NotFoundError.throwIf(!productData, `Product with [id:${id}] not found`);

        return ProductJson.fromObjectAndColor(
            productData,
            await this.colorService.getByProductId(id)
        );
    };

    async add(product: ProductJson): Promise<ProductJson> {
        this.logger.log(`Create new product`, product);

        const productData = await this.prisma.product.create({
            data: {
                name: product.getName(),
                size: product.getSize(),
                productTypeId: product.getProductTypeId(),
                threshold: product.getThreshold(),
                totalQuantity: product.getTotalQuantity()
            }
        });

        return ProductJson.fromObjectAndColor(
            productData,
            await this.setProductColors(productData.id, product.getColors())
        );
    };

    async update(productId: number, product: ProductJson): Promise<ProductJson> {
        this.logger.log(`Update product with [id=${productId}]`);

        BadRequestError.throwIf(productId != product.getId(), `Product id mismatch`);

        const existingProduct = await this.getById(productId);

        this.logger.log(`Update existing product`, existingProduct);
        this.logger.log(`Product updated data`, product);

        return ProductJson.fromObjectAndColor(
            await this.prisma.product.update({
                where: { id: productId },
                data: {
                    name: product.getName(),
                    size: product.getSize(),
                    productTypeId: product.getProductTypeId(),
                    threshold: product.getThreshold(),
                    totalQuantity: product.getTotalQuantity()
                }
            }),
            await this.setProductColors(productId, product.getColors())
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete product with [id=${id}]`);

        await this.prisma.productColor.deleteMany({ where: { productId: id } });
        await this.prisma.product.delete({
            where: { id }
        });
    }

    async updateQuantity(id: number, quantityDiff: number): Promise<void> {
        this.logger.log(`Update product quantity [id=${id}, diff=${quantityDiff}]`);

        await this.prisma.product.update({
            where: { id },
            data: {
                totalQuantity: { increment: quantityDiff }
            }
        });
    }

    private async setProductColors(productId: number, colors: ColorJson[]): Promise<ColorJson[]> {
        await this.prisma.productColor.deleteMany({ where: { productId } });

        if (!colors?.length) return [];

        await this.prisma.productColor.createMany({
            data: colors.map((c) => ({
                productId,
                colorId: c.getId()
            })),
            skipDuplicates: true
        });

        return await this.colorService.getByProductId(productId);
    }
}