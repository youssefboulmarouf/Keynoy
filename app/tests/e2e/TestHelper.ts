import request from "supertest";
import {app} from "../../src";

export async function createEntity(path: string, entity: any): Promise<any> {
    return await request(app).post(path).send(entity);
}

export async function updateEntity(path: string, entity: any): Promise<any> {
    return await request(app).put(path + "/" + entity.id).send(entity);
}