import request from "supertest";
import {app} from "../../src";

export async function getEntity(path: string): Promise<any> {
    return await request(app).get(path);
}

export async function createEntity(path: string, entity: any): Promise<any> {
    return await request(app).post(path).send(entity);
}

export async function updateEntity(path: string, entity: any): Promise<any> {
    return await request(app).put(path).send(entity);
}

export async function deleteEntity(path: string): Promise<any> {
    return await request(app).delete(path);
}