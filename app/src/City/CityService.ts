import {BaseService} from "../utilities/BaseService";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";
import {CityJson} from "./CityJson";

export class CityService extends BaseService {
    constructor() {
        super(CityService.name);
    }

    async get(): Promise<CityJson[]> {
        this.logger.log(`Get all cities`);
        const data = await this.prisma.city.findMany();
        return data.map(CityJson.from);
    }

    async getById(id: number): Promise<CityJson> {
        this.logger.log(`Get city by [id:${id}]`);

        const cityData = await this.prisma.city.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!cityData, `City with [id:${id}] not found`);

        return CityJson.from(cityData);
    }

    async add(cityJson: CityJson): Promise<CityJson> {
        this.logger.log(`Create new city`, CityJson);
        return CityJson.from(
            await this.prisma.city.create({
                data: {
                    name: cityJson.getName()
                }
            })
        );
    }

    async update(id: number, cityJson: CityJson): Promise<CityJson> {
        this.logger.log(`Update City with [id=${id}]`);

        BadRequestError.throwIf(id != cityJson.getId(), `City id mismatch`);

        const existingCity = await this.getById(id);

        this.logger.log(`Update existing color`, existingCity);
        this.logger.log(`City updated data`, cityJson);

        return CityJson.from(
            await this.prisma.city.update({
                where: { id },
                data: {
                    name: cityJson.getName()
                }
            })
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete city with [id=${id}]`);

        // TODO: avoid deleting when city is used

        await this.prisma.city.delete({
            where: { id: id }
        });
    }
}
