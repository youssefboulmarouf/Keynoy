import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TODO: add 404 & 400 test cases
describe("Customer API E2E Tests", () => {
    let customerId: number;

    // After all tests, disconnect Prisma
    afterAll(async () => {
        await prisma.$disconnect();
        stopServer(); // Stop Express server
    });

    test("Should create a new customer", async () => {
        const response = await request(app)
            .post("/api/customers")
            .send({ id: null, name: "Bob", phone: "111222333", location: "Morocco" });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toEqual("Bob");
        expect(response.body.phone).toEqual("111222333");
        expect(response.body.location).toEqual("Morocco");
        customerId = response.body.id;
    });

    test("Should retrieve all customers", async () => {
        const response = await request(app).get("/api/customers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Should get a customer by ID", async () => {
        const response = await request(app).get(`/api/customers/${customerId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Bob");
    });

    test("Should update a customer", async () => {
        const response = await request(app)
            .put(`/api/customers/${customerId}`)
            .send({ id: customerId, name: "Alice Updated", phone: "555666777", location: "San Francisco" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Alice Updated");
        expect(response.body.location).toEqual("San Francisco");
    });

    test("Should delete a customer", async () => {
        const response = await request(app).delete(`/api/customers/${customerId}`);
        expect(response.status).toBe(204);
    });
});
