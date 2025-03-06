import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Color API E2E Tests", () => {
    let dcId: number;

    // Before all tests, clear test database
    beforeAll(async () => {
        await prisma.color.deleteMany(); // Clears test data

        const response = await request(app)
            .post("/api/colors")
            .send({ id: null, name: "Red" });

        dcId = response.body.id;
    });

    // After all tests, disconnect Prisma
    afterAll(async () => {
        await prisma.$disconnect();
        stopServer(); // Stop Express server
    });

    test("Should create a new delivery company", async () => {
        const response = await request(app)
            .post("/api/colors")
            .send({ id: null, name: "Green" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("Green");
    });

    test("Should retrieve all delivery companies", async () => {
        const response = await request(app).get("/api/colors");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a delivery company by ID", async () => {
        const response = await request(app).get(`/api/colors/${dcId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Red");
    });

    test("Should update a delivery company", async () => {
        const response = await request(app)
            .put(`/api/colors/${dcId}`)
            .send({ id: dcId, name: "Yellow" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Yellow");
    });

    test("Should delete a delivery company", async () => {
        const response = await request(app).delete(`/api/colors/${dcId}`);
        expect(response.status).toBe(204);
    });
});
