import { stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";

const prisma = new PrismaClient();

describe("Product API E2E Tests", () => {
    let productId: number;

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should create a new product", async () => {
        const response = await createEntity(
            "/api/products",
            { id: null, name: "product 1", size: "Size 1", productTypeId: 1, color: "red", threshold: 0, totalQuantity: 1 }
        );

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
        const response = await getEntity("/api/products");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a product by ID", async () => {
        const response = await getEntity(`/api/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("product 1");
        expect(response.body.size).toEqual("Size 1");
        expect(response.body.productTypeId).toEqual(1);
        expect(response.body.color).toEqual("red");
        expect(response.body.threshold).toEqual(0);
        expect(response.body.totalQuantity).toEqual(1);
    });

    test("Should get 404 when product not found", async () => {
        const response = await getEntity(`/api/products/99`);

        expect(response.status).toBe(404);
    });

    test("Should update a product", async () => {
        const response = await updateEntity(
            `/api/products/${productId}`,
            { id: productId, name: "product 111", size: "Size 111", productTypeId: 2, color: "green", threshold: 10, totalQuantity: 15 }
        );

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product 111");
        expect(response.body.size).toEqual("Size 111");
        expect(response.body.productTypeId).toEqual(2);
        expect(response.body.color).toEqual("green");
        expect(response.body.threshold).toEqual(10);
        expect(response.body.totalQuantity).toEqual(15);
    });

    test("Should get 400 when product id mismatch", async () => {
        const response = await updateEntity(
            `/api/products/99`,
            { id: productId, name: "product 111", size: "Size 111", productTypeId: 2, color: "green", threshold: 10, totalQuantity: 15 }
        );

        expect(response.status).toBe(400);
    });

    test("Should delete a product", async () => {
        let response = await deleteEntity(`/api/products/${productId}`);
        expect(response.status).toBe(204);

        response = await getEntity(`/api/products/${productId}`);
        expect(response.status).toBe(404);
    });
});
