import {BaseService} from "../utilities/BaseService";
import {CompanyTypeEnum} from "./CompanyTypeEnum";
import {CompanyJson} from "./CompanyJson";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";

export class CompanyService extends BaseService {

    constructor() {
        super(CompanyService.name);
    }

    async get(): Promise<CompanyJson[]> {
        this.logger.log(`Get all customers`);
        const data = await this.prisma.company.findMany();
        return data.map((c: any) => CompanyJson.from(c));
    };

    async getCustomers(): Promise<CompanyJson[]> {
        this.logger.log(`Get all customers`);
        return await this.getCompanies(CompanyTypeEnum.CUSTOMER);
    };

    async getSuppliers(): Promise<CompanyJson[]> {
        this.logger.log(`Get all suppliers`);
        return await this.getCompanies(CompanyTypeEnum.SUPPLIER);
    };

    async getShippers(): Promise<CompanyJson[]> {
        this.logger.log(`Get all shippers`);
        return await this.getCompanies(CompanyTypeEnum.SHIPPER);
    };

    private async getCompanies(type: string): Promise<CompanyJson[]> {
        const data = await this.prisma.company.findMany({
            where: { type: type }
        });
        return data.map((c: any) => CompanyJson.from(c));
    };

    async getById(companyId: number): Promise<CompanyJson> {
        this.logger.log(`Get company by [id:${companyId}]`);
        const companyData = await this.prisma.company.findUnique({
            where: { id: companyId }
        });

        NotFoundError.throwIf(!companyData, `Customer with [id:${companyId}] not found`);

        return CompanyJson.from(companyData);
    };

    async add(company: CompanyJson): Promise<CompanyJson> {
        this.logger.log(`Create new company`, company);

        BadRequestError.throwIf(company.getType() === CompanyTypeEnum.UNKNOWN, `Company cannot be unknown.`);

        return CompanyJson.from(
            await this.prisma.company.create({
                data: {
                    name: company.getName(),
                    type: company.getType(),
                    phone: company.getPhone(),
                    location: company.getLocation()
                }
            })
        );
    };

    async update(companyId: number, company: CompanyJson): Promise<CompanyJson> {
        this.logger.log(`Update company with [id=${companyId}]`);

        BadRequestError.throwIf(companyId != company.getId(), `Company id mismatch`);

        const existingCompany = this.getById(companyId);

        this.logger.log(`Update existing company`, existingCompany);
        this.logger.log(`Company updated data`, company);

        return CompanyJson.from(
            await this.prisma.company.update({
                where: { id: companyId },
                data: {
                    name: company.getName(),
                    phone: company.getPhone(),
                    location: company.getLocation()
                }
            })
        );
    }

    async delete(companyId: number): Promise<void> {
        this.logger.log(`Delete company with [id=${companyId}]`);

        // TODO: Avoid deleting company if have orders or shipping

        await this.prisma.company.delete({
            where: { id: companyId }
        });
    }
}