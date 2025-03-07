import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Product Type API E2E Tests", () => {
    let ptId: number;

    // Before all tests, clear test database
    beforeAll(async () => {
        await prisma.productType.deleteMany(); // Clears test data

        const response = await request(app)
            .post("/api/product-types")
            .send({ id: null, name: "Bag" });

        ptId = response.body.id;
    });

    // After all tests, disconnect Prisma
    afterAll(async () => {
        await prisma.$disconnect();
        stopServer(); // Stop Express server
    });

    test("Should create a new product type", async () => {
        const response = await request(app)
            .post("/api/product-types")
            .send({ id: null, name: "Paint" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("Paint");
    });

    test("Should retrieve all product types", async () => {
        const response = await request(app).get("/api/product-types");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a product type by ID", async () => {
        const response = await request(app).get(`/api/product-types/${ptId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Bag");
    });

    test("Should update a product type", async () => {
        const response = await request(app)
            .put(`/api/product-types/${ptId}`)
            .send({ id: ptId, name: "product type" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product type");
    });

    test("Should delete a product type", async () => {
        const response = await request(app).delete(`/api/product-types/${ptId}`);
        expect(response.status).toBe(204);
    });
});
