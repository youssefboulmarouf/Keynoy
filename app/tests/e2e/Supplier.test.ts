import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TODO: add 404 & 400 test cases
describe("Supplier API E2E Tests", () => {
    let supplierId: number;

    // After all tests, disconnect Prisma
    afterAll(async () => {
        await prisma.$disconnect();
        stopServer(); // Stop Express server
    });

    test("Should create a new supplier", async () => {
        const response = await request(app)
            .post("/api/suppliers")
            .send({ id: null, name: "sup2" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("sup2");
        supplierId = response.body.id;
    });

    test("Should retrieve all suppliers", async () => {
        const response = await request(app).get("/api/suppliers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a supplier by ID", async () => {
        const response = await request(app).get(`/api/suppliers/${supplierId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("sup2");
    });

    test("Should update a supplier", async () => {
        const response = await request(app)
            .put(`/api/suppliers/${supplierId}`)
            .send({ id: supplierId, name: "sup33" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("sup33");
    });

    test("Should delete a supplier", async () => {
        const response = await request(app).delete(`/api/suppliers/${supplierId}`);
        expect(response.status).toBe(204);
    });
});
