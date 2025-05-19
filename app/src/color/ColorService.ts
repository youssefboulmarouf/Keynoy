import {BaseService} from "../utilities/BaseService";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";
import {ColorJson} from "./ColorJson";

export class ColorService extends BaseService {
    constructor() {
        super(ColorService.name);
    }

    async get(): Promise<ColorJson[]> {
        this.logger.log(`Get all colors`);
        const data = await this.prisma.color.findMany();
        return data.map(c => ColorJson.from(c));
    }

    async getById(id: number): Promise<ColorJson> {
        this.logger.log(`Get color type by [id:${id}]`);

        const colorData = await this.prisma.color.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!colorData, `Color with [id:${id}] not found`);

        return ColorJson.from(colorData);
    }

    async add(colorJson: ColorJson): Promise<ColorJson> {
        this.logger.log(`Create new color`, colorJson);
        return ColorJson.from(
            await this.prisma.color.create({
                data: {
                    name: colorJson.getName(),
                    htmlCode: colorJson.getHtmlCode()
                }
            })
        );
    }

    async update(id: number, colorJson: ColorJson): Promise<ColorJson> {
        this.logger.log(`Update color with [id=${id}]`);

        BadRequestError.throwIf(id != colorJson.getId(), `Product type id mismatch`);

        const existingColor = await this.getById(id);

        this.logger.log(`Update existing color`, existingColor);
        this.logger.log(`Color updated data`, colorJson);

        return ColorJson.from(
            await this.prisma.color.update({
                where: { id },
                data: {
                    name: colorJson.getName(),
                    htmlCode: colorJson.getHtmlCode()
                }
            })
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete color with [id=${id}]`);

        // TODO: avoid deleting when color os used in a product variation

        await this.prisma.color.delete({
            where: { id: id }
        });
    }
}
