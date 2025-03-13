import { stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";

const prisma = new PrismaClient();

describe("Delivery Company API E2E Tests", () => {
    let dcId: number;

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should create a new delivery company", async () => {
        const response = await createEntity("/api/delivery-companies", { id: null, name: "Bob" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("Bob");
        dcId = response.body.id;
    });

    test("Should retrieve all delivery companies", async () => {
        const response = await getEntity("/api/delivery-companies");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a delivery company by ID", async () => {
        const response = await getEntity(`/api/delivery-companies/${dcId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Bob");
    });

    test("Should get 404 when delivery company not found", async () => {
        const response = await getEntity(`/api/delivery-companies/99`);

        expect(response.status).toBe(404);
    });

    test("Should update a delivery company", async () => {
        const response = await updateEntity(
            `/api/delivery-companies/${dcId}`,
            { id: dcId, name: "Alice Updated" }
        );

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Alice Updated");
    });

    test("Should update a delivery company", async () => {
        const response = await updateEntity(
            `/api/delivery-companies/99`,
            { id: dcId, name: "Alice Updated" }
        );
        expect(response.status).toBe(400);
    });

    test("Should delete a delivery company", async () => {
        let response = await deleteEntity(`/api/delivery-companies/${dcId}`);
        expect(response.status).toBe(204);

        response = await getEntity(`/api/delivery-companies/${dcId}`);
        expect(response.status).toBe(404);
    });
});
