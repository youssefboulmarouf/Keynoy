import {BaseService} from "../../../utilities/BaseService";
import {DesignImageJson} from "./DesignImageJson";

export class DesignImageService extends BaseService {

    constructor() {
        super(DesignImageService.name);
    }

    async getByCompanyDesignId(companyDesignId: number): Promise<DesignImageJson[]> {
        this.logger.log(`Get design images by [companyDesignId:${companyDesignId}]`);
        const designsData = await this.prisma.designImage.findMany({
            where: { companyDesignId }
        });
        return designsData.map(DesignImageJson.from);
    }

    async addMany(designImages: DesignImageJson[], companyDesignId: number): Promise<DesignImageJson[]> {
        this.logger.log(`Create new design images`, designImages);

        await this.prisma.designImage.createMany({
            data: designImages.map(image => ({
                imageUrl: image.getImageUrl(),
                companyDesignId: companyDesignId
            }))
        })

        return this.getByCompanyDesignId(companyDesignId);
    }

    async deleteByCompanyDesignId(companyDesignId: number): Promise<void> {
        this.logger.log(`Delete design image with [companyDesignId=${companyDesignId}]`);
        await this.prisma.designImage.deleteMany({
            where: { companyDesignId }
        })
    }

}