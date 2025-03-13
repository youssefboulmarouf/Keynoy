import { stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";

const prisma = new PrismaClient();

describe("Customer API E2E Tests", () => {
    let customerId: number;

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should create a new customer", async () => {
        const response = await createEntity(
            "/api/customers",
            { id: null, name: "Bob", phone: "111222333", location: "Morocco" }
        );

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("Bob");
        expect(response.body.phone).toEqual("111222333");
        expect(response.body.location).toEqual("Morocco");
        customerId = response.body.id;
    });

    test("Should retrieve all customers", async () => {
        const response = await getEntity("/api/customers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a customer by ID", async () => {
        const response = await getEntity(`/api/customers/${customerId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Bob");
    });

    test("Should get 404 when customer not found", async () => {
        const response = await getEntity(`/api/customers/99`);

        expect(response.status).toBe(404);
    });

    test("Should update a customer", async () => {
        const response = await updateEntity(
            `/api/customers/${customerId}`,
            { id: customerId, name: "Alice Updated", phone: "555666777", location: "San Francisco" }
        );

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Alice Updated");
        expect(response.body.location).toEqual("San Francisco");
    });

    test("Should get 400 when customer id mismatch", async () => {
        const response = await updateEntity(
            `/api/customers/99`,
            { id: customerId, name: "Alice Updated", phone: "555666777", location: "San Francisco" }
        );

        expect(response.status).toBe(400);
    });

    test("Should delete a customer", async () => {
        let response = await deleteEntity(`/api/customers/${customerId}`);
        expect(response.status).toBe(204);

        response = await getEntity(`/api/customers/${customerId}`);
        expect(response.status).toBe(404);
    });
});
