import {BaseService} from "../../utilities/BaseService";
import {CompanyDesignJson} from "./CompanyDesignJson";
import {DesignImageJson} from "./design-image/DesignImageJson";
import {DesignImageService} from "./design-image/DesignImageService";
import NotFoundError from "../../utilities/errors/NotFoundError";
import BadRequestError from "../../utilities/errors/BadRequestError";

export class CompanyDesignService extends BaseService {

    private readonly designImageService: DesignImageService;

    constructor() {
        super(CompanyDesignService.name);
        this.designImageService = new DesignImageService();
    }

    async get(): Promise<CompanyDesignJson[]> {
        this.logger.log(`Get all companies designs`);
        const cdData = await this.prisma.companyDesign.findMany({include: { designImages: true }})
        return cdData.map(cd =>
            CompanyDesignJson.fromObjectAndDesignImages(
                cd,
                cd.designImages.map(DesignImageJson.from)
            )
        )
    }

    async getById(id: number): Promise<CompanyDesignJson> {
        this.logger.log(`Get company design by [id:${id}]`);
        const cdData = await this.prisma.companyDesign.findUnique({
            where: {id},
            include: { designImages: true }
        })

        NotFoundError.throwIf(!cdData, `Company design with [id:${id}] not found`);

        return CompanyDesignJson.fromObjectAndDesignImages(
            cdData,
            cdData?.designImages.map(DesignImageJson.from) ?? []
        )
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

    async add(companyDesign: CompanyDesignJson): Promise<CompanyDesignJson> {
        this.logger.log(`Create new company design`, companyDesign);

        // TODO: Should only add design when company is a customer

        const cdData = await this.prisma.companyDesign.create({
            data: {
                designName: companyDesign.getDesignName(),
                companyId: companyDesign.getCompanyId()
            }
        });

        this.logger.log(`Created company design with [id: ${cdData.id}]`);

        const createdImages = await this.designImageService.addMany(companyDesign.getDesignImages(), cdData.id);

        return CompanyDesignJson.fromObjectAndDesignImages(
            cdData,
            createdImages
        );
    }

    async update(id: number, companyDesign: CompanyDesignJson): Promise<CompanyDesignJson> {
        this.logger.log(`Update company design with [id=${id}]`);
        BadRequestError.throwIf(id != companyDesign.getId(), `Company design id mismatch`);

        // TODO: Should only add design when company is a customer
        const existingDesign = await this.getById(id);
        this.logger.log(`Update existing company design`, existingDesign);
        this.logger.log(`Company design updated data`, companyDesign);

        await this.designImageService.deleteByCompanyDesignId(id);

        const cdData = await this.prisma.companyDesign.update({
            where: { id },
            data: {
                designName: companyDesign.getDesignName(),
                companyId: companyDesign.getCompanyId()
            }
        });

        const createdImages = await this.designImageService.addMany(companyDesign.getDesignImages(), id);

        return CompanyDesignJson.fromObjectAndDesignImages(
            cdData,
            createdImages
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete company design with [id=${id}]`);

        // TODO avoid delete cd if used in order

        await this.designImageService.deleteByCompanyDesignId(id);
        await this.prisma.companyDesign.delete({
            where: { id },
        })
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