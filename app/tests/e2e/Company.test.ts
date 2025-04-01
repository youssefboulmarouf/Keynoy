import { stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";
import {CompanyTypeEnum} from "../../src/company/CompanyTypeEnum";

const prisma = new PrismaClient();

describe("Customer API E2E Tests", () => {
    let customerId: number;
    let supplierId: number;
    let shipperId: number;

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should create a new customer", async () => {
        const customerResponse = await createEntity(
            "/api/companies",
            { id: null, type: CompanyTypeEnum.CUSTOMER, name: "customer", phone: "111222333", location: "Morocco" }
        );

        expect(customerResponse.status).toBe(201);
        expect(customerResponse.body).toHaveProperty("id");
        expect(customerResponse.body.id).not.toBeNull();
        expect(customerResponse.body.name).toEqual("customer");
        expect(customerResponse.body.type).toEqual(CompanyTypeEnum.CUSTOMER);
        expect(customerResponse.body.phone).toEqual("111222333");
        expect(customerResponse.body.location).toEqual("Morocco");
        customerId = customerResponse.body.id;
    });

    test("Should create a new supplier", async () => {
        const supplierResponse = await createEntity(
            "/api/companies",
            { id: null, type: CompanyTypeEnum.SUPPLIER, name: "supplier", phone: "999888777", location: "Morocco" }
        );

        expect(supplierResponse.status).toBe(201);
        expect(supplierResponse.body).toHaveProperty("id");
        expect(supplierResponse.body.id).not.toBeNull();
        expect(supplierResponse.body.name).toEqual("supplier");
        expect(supplierResponse.body.type).toEqual(CompanyTypeEnum.SUPPLIER);
        expect(supplierResponse.body.phone).toEqual("999888777");
        expect(supplierResponse.body.location).toEqual("Morocco");
        supplierId = supplierResponse.body.id;
    });

    test("Should create a new shipper", async () => {
        const shipperResponse = await createEntity(
            "/api/companies",
            { id: null, type: CompanyTypeEnum.SHIPPER, name: "shipper", phone: "555444999", location: "Morocco" }
        );

        expect(shipperResponse.status).toBe(201);
        expect(shipperResponse.body).toHaveProperty("id");
        expect(shipperResponse.body.id).not.toBeNull();
        expect(shipperResponse.body.name).toEqual("shipper");
        expect(shipperResponse.body.type).toEqual(CompanyTypeEnum.SHIPPER);
        expect(shipperResponse.body.phone).toEqual("555444999");
        expect(shipperResponse.body.location).toEqual("Morocco");
        shipperId = shipperResponse.body.id;
    });

    test("Should retrieve all customers", async () => {
        const response = await getEntity("/api/companies/customers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);
        expect(response.body[0].id).toEqual(customerId);
        expect(response.body[0].name).toEqual("customer");
        expect(response.body[0].type).toEqual(CompanyTypeEnum.CUSTOMER);
        expect(response.body[0].phone).toEqual("111222333");
    });

    test("Should get a customer by ID", async () => {
        const response = await getEntity(`/api/companies/${customerId}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("customer");
        expect(response.body.type).toEqual(CompanyTypeEnum.CUSTOMER);
        expect(response.body.phone).toEqual("111222333");
        expect(response.body.location).toEqual("Morocco");
    });

    test("Should retrieve all suppliers", async () => {
        const response = await getEntity("/api/companies/suppliers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);
        expect(response.body[0].id).toEqual(supplierId);
        expect(response.body[0].name).toEqual("supplier");
        expect(response.body[0].type).toEqual(CompanyTypeEnum.SUPPLIER);
        expect(response.body[0].phone).toEqual("999888777");
    });

    test("Should get a supplier by ID", async () => {
        const response = await getEntity(`/api/companies/${supplierId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(supplierId);
        expect(response.body.name).toEqual("supplier");
        expect(response.body.type).toEqual(CompanyTypeEnum.SUPPLIER);
        expect(response.body.phone).toEqual("999888777");
    });

    test("Should retrieve all shippers", async () => {
        const response = await getEntity("/api/companies/shippers");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        const shipper = response.body.filter((com: any) => com.id == shipperId);
        expect(shipper[0].id).toEqual(shipperId);
        expect(shipper[0].name).toEqual("shipper");
        expect(shipper[0].type).toEqual(CompanyTypeEnum.SHIPPER);
        expect(shipper[0].phone).toEqual("555444999");
    });

    test("Should get a shipper by ID", async () => {
        const response = await getEntity(`/api/companies/${shipperId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(shipperId);
        expect(response.body.name).toEqual("shipper");
        expect(response.body.type).toEqual(CompanyTypeEnum.SHIPPER);
        expect(response.body.phone).toEqual("555444999");
    });

    test("Should get 404 when company not found", async () => {
        const response = await getEntity(`/api/customers/99`);
        expect(response.status).toBe(404);
    });

    test("Should update a company", async () => {
        const response = await updateEntity(
            `/api/companies/${customerId}`,
            { id: customerId, type: CompanyTypeEnum.CUSTOMER, name: "Alice Updated", phone: "111", location: "San Francisco" }
        );

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Alice Updated");
        expect(response.body.phone).toBe("111");
        expect(response.body.location).toEqual("San Francisco");
        expect(response.body.type).toEqual(CompanyTypeEnum.CUSTOMER);
    });

    test("Should get 400 when company id mismatch", async () => {
        const response = await updateEntity(
            `/api/companies/99`,
            { id: customerId, type: CompanyTypeEnum.UNKNOWN, name: "Alice Updated", phone: "555666777", location: "San Francisco" }
        );

        expect(response.status).toBe(400);
    });

    test("Should delete a company", async () => {
        let response = await deleteEntity(`/api/companies/${customerId}`);
        expect(response.status).toBe(204);

        response = await getEntity(`/api/companies/${customerId}`);
        expect(response.status).toBe(404);
    });
});
