import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Delivery Company API E2E Tests", () => {
    let dcId: number;

    // After all tests, disconnect Prisma
    afterAll(async () => {
        await prisma.$disconnect();
        stopServer(); // Stop Express server
    });

    test("Should create a new delivery company", async () => {
        const response = await request(app)
            .post("/api/delivery-companies")
            .send({ id: null, name: "Bob" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("Bob");
        dcId = response.body.id;
    });

    test("Should retrieve all delivery companies", async () => {
        const response = await request(app).get("/api/delivery-companies");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a delivery company by ID", async () => {
        const response = await request(app).get(`/api/delivery-companies/${dcId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Bob");
    });

    test("Should update a delivery company", async () => {
        const response = await request(app)
            .put(`/api/delivery-companies/${dcId}`)
            .send({ id: dcId, name: "Alice Updated" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Alice Updated");
    });

    test("Should delete a delivery company", async () => {
        const response = await request(app).delete(`/api/delivery-companies/${dcId}`);
        expect(response.status).toBe(204);
    });
});
