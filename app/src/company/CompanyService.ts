import {BaseService} from "../utilities/BaseService";
import {CompanyTypeEnum} from "./CompanyTypeEnum";
import {CompanyJson} from "./CompanyJson";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";
import {CompanyDesignService} from "./CompanyDesignService";
import {CompanyDesignJson} from "./CompanyDesignJson";

export class CompanyService extends BaseService {

    private readonly companyDesignService :CompanyDesignService;

    constructor() {
        super(CompanyService.name);
        this.companyDesignService = new CompanyDesignService();
    }

    async get(): Promise<CompanyJson[]> {
        this.logger.log(`Get all companies`);
        const companiesData = await this.prisma.company.findMany({
            include: { designs: true }
        });

        return companiesData.map(c =>
            CompanyJson.fromObjectAndDesigns(c, c.designs.map(CompanyDesignJson.from))
        );
    };

    async getById(id: number): Promise<CompanyJson> {
        this.logger.log(`Get company by [id:${id}]`);
        const companyData = await this.prisma.company.findUnique({
            where: { id },
            include: { designs: true }
        });

        NotFoundError.throwIf(!companyData, `Company with [id:${id}] not found`);

        return CompanyJson.fromObjectAndDesigns(
            companyData,
            companyData?.designs.map(CompanyDesignJson.from) || []
        );
    };

    async add(company: CompanyJson): Promise<CompanyJson> {
        this.logger.log(`Create new company`, company);

        BadRequestError.throwIf(company.getType() === CompanyTypeEnum.UNKNOWN, `Company cannot be unknown.`);

        const companyData = await this.prisma.company.create({
            data: {
                name: company.getName(),
                type: company.getType(),
                phone: company.getPhone(),
                location: company.getLocation()
            }
        });

        this.logger.log(`Created company with [id: ${companyData.id}]`);

        return CompanyJson.fromObjectAndDesigns(
            companyData,
            await this.companyDesignService.addList(company.getDesignUrls(), companyData.id)
        )
    };

    async update(id: number, company: CompanyJson): Promise<CompanyJson> {
        this.logger.log(`Update company with [id=${id}]`);

        BadRequestError.throwIf(id != company.getId(), `Company id mismatch`);

        const existingCompany = await this.getById(id);

        this.logger.log(`Update existing company`, existingCompany);
        this.logger.log(`Company updated data`, company);

        await this.companyDesignService.deleteByCompanyId(id);

        return CompanyJson.fromObjectAndDesigns(
            await this.prisma.company.update({
                where: { id },
                data: {
                    name: company.getName(),
                    phone: company.getPhone(),
                    location: company.getLocation()
                }
            }),
            await this.companyDesignService.addList(company.getDesignUrls(), id)
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete company with [id=${id}]`);

        // TODO: Avoid deleting company if have orders or shipping

        await this.companyDesignService.deleteByCompanyId(id);
        await this.prisma.company.delete({
            where: { id }
        });
    }
}