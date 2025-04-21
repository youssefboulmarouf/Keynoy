import {BaseService} from "../../../utilities/BaseService";
import {DesignImageJson} from "./DesignImageJson";
import NotFoundError from "../../../utilities/errors/NotFoundError";

export class DesignImageService extends BaseService {

    async get(): Promise<DesignImageJson[]> {
        this.logger.log(`Get all design images`);
        const designsData = await this.prisma.designImage.findMany();
        return designsData.map(DesignImageJson.from);
    }

    async getById(id: number): Promise<DesignImageJson> {
        this.logger.log(`Get design image by [id:${id}]`);
        const designData = await this.prisma.designImage.findUnique({
            where: { id }
        });
        NotFoundError.throwIf(!designData, `Design image with [id:${id}] not found`);
        return DesignImageJson.from(designData);
    }

    async getByCompanyDesignId(companyDesignId: number): Promise<DesignImageJson[]> {
        this.logger.log(`Get design images by [companyDesignId:${companyDesignId}]`);
        const designsData = await this.prisma.designImage.findMany({
            where: { companyDesignId }
        });
        return designsData.map(DesignImageJson.from);
    }

    async add(designImage: DesignImageJson): Promise<DesignImageJson> {
        this.logger.log(`Create new design image`, designImage);
        return DesignImageJson.from(
            await this.prisma.designImage.create({
                data: {
                    imageUrl: designImage.getImageUrl(),
                    companyDesignId: designImage.getCompanyDesignId()
                }
            })
        );
    }

    async addMany(designImages: DesignImageJson[], companyDesignId: number): Promise<DesignImageJson[]> {
        this.logger.log(`Create new design images`, designImages);

        await this.prisma.designImage.createMany({
            data: designImages.map(image => ({
                imageUrl: image.getImageUrl(),
                companyDesignId: image.getCompanyDesignId()
            }))
        })

        return this.getByCompanyDesignId(companyDesignId);
    }

    // Don't use this, instead of updating, delete then add
    update(id: number, entity: any): any {
        this.logger.log(`This method should not be used`);
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete design image with [id=${id}]`);
        await this.prisma.designImage.delete({
            where: { id }
        })
    }

    async deleteByCompanyDesignId(companyDesignId: number): Promise<void> {
        this.logger.log(`Delete design image with [companyDesignId=${companyDesignId}]`);
        await this.prisma.designImage.deleteMany({
            where: { companyDesignId }
        })
    }

}