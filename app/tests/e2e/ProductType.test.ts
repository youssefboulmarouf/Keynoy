import { stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";

const prisma = new PrismaClient();

describe("Product Type API E2E Tests", () => {
    let ptId: number;

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should create a new product type", async () => {
        const response = await createEntity("/api/product-types", { id: null, name: "Paint" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("Paint");
        ptId = response.body.id;
    });

    test("Should retrieve all product types", async () => {
        const response = await getEntity("/api/product-types");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a product type by ID", async () => {
        const response = await getEntity(`/api/product-types/${ptId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Paint");
    });

    test("Should get 404 when product type not found", async () => {
        const response = await getEntity(`/api/product-types/99`);

        expect(response.status).toBe(404);
    });

    test("Should update a product type", async () => {
        const response = await updateEntity(
            `/api/product-types/${ptId}`,
            { id: ptId, name: "product type" }
        );

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("product type");
    });

    test("Should get 400 when product type id mismatch", async () => {
        const response = await updateEntity(
            `/api/product-types/99`,
            { id: ptId, name: "product type" }
        );

        expect(response.status).toBe(400);
    });

    test("Should delete a product type", async () => {
        let response = await deleteEntity(`/api/product-types/${ptId}`);
        expect(response.status).toBe(204);

        response = await getEntity(`/api/product-types/${ptId}`);
        expect(response.status).toBe(404);
    });
});
