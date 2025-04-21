import {BaseService} from "../utilities/BaseService";
import {CompanyTypeEnum, mapCompanyTypeEnumToCompanyType} from "./CompanyTypeEnum";
import {CompanyJson} from "./CompanyJson";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";
import {CompanyDesignService} from "./company-design/CompanyDesignService";

export class CompanyService extends BaseService {

    private readonly companyDesignService: CompanyDesignService;

    constructor() {
        super(CompanyService.name);
        this.companyDesignService = new CompanyDesignService();
    }

    async get(): Promise<CompanyJson[]> {
        this.logger.log(`Get all companies`);

        const companiesData = await this.prisma.company.findMany();

        return await Promise.all(
            companiesData.map(async c =>
                CompanyJson.fromObjectAndCompanyDesigns(
                    c,
                    await this.companyDesignService.getByCompanyId(c.id)
                )
            )
        )
    }

    async getById(id: number): Promise<CompanyJson> {
        this.logger.log(`Get company by [id:${id}]`);
        const companyData = await this.prisma.company.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!companyData, `Company with [id:${id}] not found`);

        return CompanyJson.fromObjectAndCompanyDesigns(
            companyData,
            await this.companyDesignService.getByCompanyId(companyData?.id ?? 0)
        );
    };

    async add(company: CompanyJson): Promise<CompanyJson> {
        this.logger.log(`Create new company`, company);

        BadRequestError.throwIf(company.getCompanyType() === CompanyTypeEnum.UNKNOWN, `Company cannot be unknown.`);

        const companyData = await this.prisma.company.create({
            data: {
                name: company.getName(),
                companyType: mapCompanyTypeEnumToCompanyType(company.getCompanyType()),
                phone: company.getPhone(),
                location: company.getLocation()
            }
        });

        this.logger.log(`Created company with [id: ${companyData.id}]`);

        if (company.getCompanyType() === CompanyTypeEnum.CUSTOMER) {
            return CompanyJson.fromObjectAndCompanyDesigns(
                companyData,
                await this.companyDesignService.addMany(company.getCompanyDesigns(), companyData.id)
            )
        } else {
            return CompanyJson.fromObjectAndCompanyDesigns(companyData, [])
        }
    };

    async update(id: number, company: CompanyJson): Promise<CompanyJson> {
        this.logger.log(`Update company with [id=${id}]`);

        BadRequestError.throwIf(id != company.getId(), `Company id mismatch`);

        const existingCompany = await this.getById(id);

        this.logger.log(`Update existing company`, existingCompany);
        this.logger.log(`Company updated data`, company);

        await this.companyDesignService.deleteByCompanyId(id);

        return CompanyJson.fromObjectAndCompanyDesigns(
            await this.prisma.company.update({
                where: { id },
                data: {
                    name: company.getName(),
                    companyType: mapCompanyTypeEnumToCompanyType(company.getCompanyType()),
                    phone: company.getPhone(),
                    location: company.getLocation()
                }
            }),
            await this.companyDesignService.addMany(company.getCompanyDesigns(), id)
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