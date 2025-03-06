import { PrismaClient } from "@prisma/client";

export abstract class BaseService {
    protected prisma: PrismaClient;

    protected constructor() {
        this.prisma = new PrismaClient();
    }

    abstract get(): any;
    abstract getById(id: number): any;
    abstract add(entity: any): any;
    abstract update(id: number, entity: any): any;
    abstract delete(id: number): void;
}
