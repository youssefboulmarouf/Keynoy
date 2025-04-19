import {BaseService} from "../utilities/BaseService";
import NotFoundError from "../utilities/errors/NotFoundError";
import {CompanyDesignJson} from "./CompanyDesignJson";

export class CompanyDesignService extends BaseService {

    constructor() {
        super(CompanyDesignService.name);
    }

    async get(): Promise<CompanyDesignJson[]> {
        this.logger.log(`Get all designs`);
        const designData = await this.prisma.companyDesign.findMany();
        return designData.map(d => CompanyDesignJson.from(d));
    };

    async getById(id: number): Promise<CompanyDesignJson> {
        this.logger.log(`Get design by [id:${id}]`);
        const designData = await this.prisma.companyDesign.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!designData, `Design with [id:${id}] not found`);

        return CompanyDesignJson.from(designData);
    };

    async getByCompanyId(companyId: number): Promise<CompanyDesignJson[]> {
        this.logger.log(`Get designs by [company_id:${companyId}]`);
        const designData = await this.prisma.companyDesign.findMany({
            where: { companyId }
        });

        return designData.map(d => CompanyDesignJson.from(d));
    };

    async add(companyDesign: CompanyDesignJson): Promise<CompanyDesignJson> {
        this.logger.log(`Create new design`, companyDesign);

        return CompanyDesignJson.from(
            await this.prisma.companyDesign.create({
                data: {
                    designName: companyDesign.getDesignName(),
                    designUrl: companyDesign.getDesignUrl(),
                    companyId: companyDesign.getCompanyId()
                }
            })
        );
    };

    async addList(companyDesigns: CompanyDesignJson[], companyId: number): Promise<CompanyDesignJson[]> {
        this.logger.log(`Create multiple designs`);

        await this.prisma.companyDesign.createMany({
            data: companyDesigns.map(design => ({
                designName: design.getDesignName(),
                designUrl: design.getDesignUrl(),
                companyId
            }))
        });

        return this.getByCompanyId(companyId);
    }

    // Don't use this, instead of updating, delete then add
    update(id: number, entity: any): any {
        this.logger.log(`This method should not be used`);
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete design with [id=${id}]`);

        await this.prisma.companyDesign.delete({
            where: { id }
        });
    }

    async deleteByCompanyId(companyId: number): Promise<void> {
        this.logger.log(`Delete design with [company_id=${companyId}]`);

        await this.prisma.companyDesign.deleteMany({
            where: { companyId }
        });
    }
}