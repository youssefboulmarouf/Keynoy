import {BaseService} from "../utilities/BaseService";
import {ProductJson} from "./ProductJson";
import {ColorEnum} from "./ColorEnum";
import AppError from "../utilities/errors/AppError";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";
import {CompanyTypeEnum} from "../company/CompanyTypeEnum";

export class ProductService extends BaseService {
    constructor() {
        super(ProductService.name);
    }

    async get(): Promise<ProductJson[]> {
        this.logger.log(`Get all products`);
        const data = await this.prisma.product.findMany();
        return data.map((c: any) => ProductJson.from(c));
    };

    async getById(productId: number): Promise<ProductJson> {
        this.logger.log(`Get product by [id:${productId}]`);

        const productData = await this.prisma.product.findUnique({
            where: { id: productId }
        });
        NotFoundError.throwIf(!productData, `Product with [id:${productId}] not found`);

        return ProductJson.from(productData);
    };

    async add(product: ProductJson): Promise<ProductJson> {
        this.logger.log(`Create new product`, product);
        return ProductJson.from(
            await this.prisma.product.create({
                data: {
                    name: product.getName(),
                    size: product.getSize(),
                    productTypeId: product.getProductTypeId(),
                    color: product.getColor() == ColorEnum.UNKNOWN ? '' : product.getColor(),
                    threshold: product.getThreshold(),
                    totalQuantity: product.getTotalQuantity()
                }
            })
        );
    };

    async update(productId: number, product: any): Promise<ProductJson> {
        this.logger.log(`Update product with [id=${productId}]`);

        BadRequestError.throwIf(productId != product.getId(), `Product id mismatch`);

        const existingProduct = this.getById(productId);

        this.logger.log(`Update existing product`, existingProduct);
        this.logger.log(`Product updated data`, product);

        return ProductJson.from(
            await this.prisma.product.update({
                where: { id: productId },
                data: {
                    name: product.getName(),
                    size: product.getSize(),
                    productTypeId: product.getProductTypeId(),
                    color: product.getColor() == ColorEnum.UNKNOWN ? '' : product.getColor(),
                    threshold: product.getThreshold(),
                    totalQuantity: product.getTotalQuantity()
                }
            })
        );
    }

    async delete(productId: number): Promise<void> {
        this.logger.log(`Delete product with [id=${productId}]`);

        await this.prisma.product.delete({
            where: { id: productId }
        });
    }

    async updateQuantity(productId: number, quantityDiff: number): Promise<void> {
        const product = await this.getById(productId);
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                name: product.getName(),
                size: product.getSize(),
                productTypeId: product.getProductTypeId(),
                color: product.getColor() == ColorEnum.UNKNOWN ? '' : product.getColor(),
                threshold: product.getThreshold(),
                totalQuantity: (product.getTotalQuantity() + quantityDiff)
            }
        })
    }
}