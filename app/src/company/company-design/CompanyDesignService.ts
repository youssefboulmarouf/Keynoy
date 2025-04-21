import {BaseService} from "../../utilities/BaseService";
import {CompanyDesignJson} from "./CompanyDesignJson";
import {DesignImageJson} from "./design-image/DesignImageJson";
import {DesignImageService} from "./design-image/DesignImageService";

export class CompanyDesignService extends BaseService {

    private readonly designImageService: DesignImageService;

    constructor() {
        super(CompanyDesignService.name);
        this.designImageService = new DesignImageService();
    }

    async getByCompanyId(companyId: number): Promise<CompanyDesignJson[]> {
        this.logger.log(`Get designs by [company_id:${companyId}]`);
        const cdData = await this.prisma.companyDesign.findMany({
            where: { companyId },
            include: { designImages: true }
        });

        return cdData.map(cd =>
            CompanyDesignJson.fromObjectAndDesignImages(
                cd,
                cd.designImages.map(DesignImageJson.from)
            )
        );
    };

    async addMany(designs: CompanyDesignJson[], companyId: number): Promise<CompanyDesignJson[]> {
        this.logger.log(`Create multiple company designs`, designs);

        const createdDesigns: CompanyDesignJson[] = [];

        for (const design of designs) {
            const cdData = await this.prisma.companyDesign.create({
                data: {
                    designName: design.getDesignName(),
                    companyId: companyId
                }
            });

            this.logger.log(`Created company design with [id: ${cdData.id}]`);

            const createdImages = await this.designImageService.addMany(
                design.getDesignImages(),
                cdData.id
            );

            const companyDesignJson = CompanyDesignJson.fromObjectAndDesignImages(
                cdData,
                createdImages
            );
            createdDesigns.push(companyDesignJson);
        }

        return createdDesigns;
    }

    async deleteByCompanyId(companyId: number): Promise<void> {
        this.logger.log(`Delete design with [company_id=${companyId}]`);

        // TODO avoid delete cd if used in order

        const companyDesignJsons = await this.getByCompanyId(companyId);

        await Promise.all(
            companyDesignJsons.map(
                async cd => await this.designImageService.deleteByCompanyDesignId(cd.getId())
            )
        );

        await this.prisma.companyDesign.deleteMany({
            where: { companyId }
        });
    }
}