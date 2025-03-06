import {BaseService} from "../../utilities/BaseService";
import {ColorJson} from "./ColorJson";

export class ColorService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<ColorJson[]> {
        const data = await this.prisma.color.findMany();
        return data.map((c: any) => ColorJson.from(c));
    }

    async getById(colorId: number): Promise<ColorJson> {
        return ColorJson.from(
            await this.prisma.color.findUnique({ where: { id: colorId } })
        );
    }

    async add(color: ColorJson): Promise<ColorJson> {
        return ColorJson.from(
            await this.prisma.color.create({
                data: {
                    name: color.getName()
                }
            })
        );
    }

    async update(colorId: number, color: any): Promise<ColorJson> {
        return ColorJson.from(
            await this.prisma.color.update({
                where: { id: colorId },
                data: {
                    name: color.getName()
                }
            })
        );
    }

    async delete(colorId: number): Promise<void> {
        await this.prisma.color.delete({
            where: { id: colorId }
        });
    }

}
