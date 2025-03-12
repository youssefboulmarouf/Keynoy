import { PrismaClient } from "@prisma/client";
import Logger from "./Logger";

export abstract class BaseService {
    protected prisma: PrismaClient;
    protected readonly logger: Logger;

    protected constructor(className: string) {
        this.prisma = new PrismaClient();
        this.logger = new Logger(className);
    }

    abstract get(): any;
    abstract getById(id: number): any;
    abstract add(entity: any): any;
    abstract update(id: number, entity: any): any;
    abstract delete(id: number): void;
}
