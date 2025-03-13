import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";

const prisma = new PrismaClient();

describe("Supplier API E2E Tests", () => {
    let supplierId: number;

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should create a new supplier", async () => {
        const response = await createEntity("/api/suppliers", { id: null, name: "sup2" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("sup2");
        supplierId = response.body.id;
    });

    test("Should retrieve all suppliers", async () => {
        const response = await getEntity("/api/suppliers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a supplier by ID", async () => {
        const response = await getEntity(`/api/suppliers/${supplierId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("sup2");
    });

    test("Should get 404 when supplier not found", async () => {
        const response = await getEntity(`/api/suppliers/99`);

        expect(response.status).toBe(404);
    });

    test("Should update a supplier", async () => {
        const response = await updateEntity(
            `/api/suppliers/${supplierId}`,
            { id: supplierId, name: "sup33" }
        );

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("sup33");
    });

    test("Should get 400 when supplier id mismatch", async () => {
        const response = await updateEntity(
            `/api/suppliers/99`,
            { id: supplierId, name: "sup33" }
        );

        expect(response.status).toBe(400);
    });

    test("Should delete a supplier", async () => {
        let response = await deleteEntity(`/api/suppliers/${supplierId}`);
        expect(response.status).toBe(204);

        response = await getEntity(`/api/suppliers/${supplierId}`);
        expect(response.status).toBe(404);
    });
});
