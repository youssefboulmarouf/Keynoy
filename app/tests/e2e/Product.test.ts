import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TODO: add 404 & 400 test cases
describe("Product API E2E Tests", () => {
    let productId: number;

    // After all tests, disconnect Prisma
    afterAll(async () => {
        await prisma.$disconnect();
        stopServer(); // Stop Express server
    });

    test("Should create a new product", async () => {
        const response = await request(app)
            .post("/api/products")
            .send({ id: null, name: "product 1", size: "Size 1", productTypeId: 1, color: "red", threshold: 0, totalQuantity: 1 });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("product 1");
        expect(response.body.size).toEqual("Size 1");
        expect(response.body.productTypeId).toEqual(1);
        expect(response.body.color).toEqual("red");
        expect(response.body.threshold).toEqual(0);
        expect(response.body.totalQuantity).toEqual(1);
        productId = response.body.id;
    });

    test("Should retrieve all products", async () => {
        const response = await request(app).get("/api/products");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a product by ID", async () => {
        const response = await request(app).get(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("product 1");
        expect(response.body.size).toEqual("Size 1");
        expect(response.body.productTypeId).toEqual(1);
        expect(response.body.color).toEqual("red");
        expect(response.body.threshold).toEqual(0);
        expect(response.body.totalQuantity).toEqual(1);
    });

    test("Should update a product", async () => {
        const response = await request(app)
            .put(`/api/products/${productId}`)
            .send({ id: productId, name: "product 111", size: "Size 111", productTypeId: 2, color: "green", threshold: 10, totalQuantity: 15 });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product 111");
        expect(response.body.size).toEqual("Size 111");
        expect(response.body.productTypeId).toEqual(2);
        expect(response.body.color).toEqual("green");
        expect(response.body.threshold).toEqual(10);
        expect(response.body.totalQuantity).toEqual(15);
    });

    test("Should delete a product", async () => {
        const response = await request(app).delete(`/api/products/${productId}`);
        expect(response.status).toBe(204);
    });
});
