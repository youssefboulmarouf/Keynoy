import {BaseService} from "../utilities/BaseService";
import {ProductJson} from "./ProductJson";
import {ColorEnum} from "./ColorEnum";

export class ProductService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<ProductJson[]> {
        const data = await this.prisma.products.findMany();
        return data.map((c: any) => ProductJson.from(c));
    };

    async getById(productId: number): Promise<ProductJson> {
        return ProductJson.from(
            await this.prisma.products.findUnique({
                    where: { id: productId }
            })
        );
    };

    async add(product: ProductJson): Promise<ProductJson> {
        return ProductJson.from(
            await this.prisma.products.create({
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
        return ProductJson.from(
            await this.prisma.products.update({
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
        await this.prisma.products.delete({
            where: { id: productId }
        });
    }
}