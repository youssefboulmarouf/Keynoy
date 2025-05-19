import {ProductJson} from "./ProductJson";
import {BaseService} from "../../utilities/BaseService";
import {ProductVariationService} from "../product-variation/ProductVariationService";
import NotFoundError from "../../utilities/errors/NotFoundError";
import BadRequestError from "../../utilities/errors/BadRequestError";

export class ProductService extends BaseService {
    private readonly productVariationService = new ProductVariationService();
    constructor() {
        super(ProductService.name);
    }

    async get(): Promise<ProductJson[]> {
        this.logger.log("Get all products");
        return (await this.prisma.product.findMany()).map(ProductJson.fromObject)
    }

    async getById(id: number): Promise<ProductJson> {
        this.logger.log(`Get product by [id:${id}]`);

        const productData = await this.prisma.product.findUnique({
            where: { id }
        });
        NotFoundError.throwIf(!productData, `Product with [id:${id}] not found`);

        return ProductJson.fromObject(productData);
    }

    async add(product: ProductJson): Promise<ProductJson> {
        this.logger.log(`Create new product`, product);

        const productData = await this.prisma.product.create({
            data: {
                name: product.getName(),
                isSellable: product.getSellable(),
                isLayer: product.getLayer(),
                productTypeId: product.getProductTypeId()
            }
        });

        this.logger.log(`New product created with [id; ${productData.id}]`);

        return ProductJson.fromObject(productData);
    };

    async update(productId: number, product: ProductJson): Promise<ProductJson> {
        this.logger.log(`Update product with [id=${productId}]`);

        BadRequestError.throwIf(productId != product.getId(), `Product id mismatch`);

        const existingProduct = await this.getById(productId);

        this.logger.log(`Update existing product`, existingProduct);
        this.logger.log(`Product updated data`, product);

        await this.prisma.product.update({
            where: { id: productId },
            data: {
                name: product.getName(),
                isSellable: product.getSellable(),
                isLayer: product.getLayer(),
                productTypeId: product.getProductTypeId()
            }
        })

        return await this.getById(productId);
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete product with [id=${id}]`);

        await this.productVariationService.deleteByProductId(id);
        await this.prisma.product.delete({
            where: { id }
        });
    }

    async deleteByProductType(productTypeId: number): Promise<void> {
        this.logger.log(`Delete product with [productTypeId=${productTypeId}]`);

        const products = await this.getByProductTypeId(productTypeId);

        await Promise.all(
            products.map(async (product) => {
                await this.productVariationService.deleteByProductId(product.getId());
            })
        )

        await this.prisma.product.deleteMany({
            where: { productTypeId }
        })
    }

    private async getByProductTypeId(productTypeId: number): Promise<ProductJson[]> {
        this.logger.log(`Get product by [productTypeId:${productTypeId}]`);

        const productData = await this.prisma.product.findMany({
            where: { productTypeId }
        });

        return productData.map(ProductJson.fromObject);
    }
}