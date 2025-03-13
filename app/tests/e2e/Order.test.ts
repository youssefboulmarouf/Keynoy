import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import { createEntity } from "./TestHelper";
import {CustomerJson} from "../../src/customer/CustomerJson";
import {SupplierJson} from "../../src/supplier/SupplierJson";
import {OrderTypeEnum} from "../../src/order/OrderTypeEnum";
import {OrderStatusEnum} from "../../src/order/OrderStatusEnum";
import {OrderLineJson} from "../../src/order/OrderLineJson";

const prisma = new PrismaClient();

// TODO: add 404 & 400 test cases
describe("Order API E2E Tests", () => {
    let customer: CustomerJson;
    let supplier: SupplierJson;
    let orderId: number;

    beforeAll(async () => {
        const customerResponse = await createEntity(
            "/api/customers",
            { id: null, name: "Bob", phone: "111222333", location: "Morocco" }
        );
        customer = CustomerJson.from(customerResponse.body);

        const supplierResponse = await createEntity(
            "/api/suppliers",
            { id: null, name: "Sup" }
        );
        supplier = SupplierJson.from(supplierResponse.body);
    })

    // After all tests, disconnect Prisma
    afterAll(async () => {
        await prisma.$disconnect();
        stopServer(); // Stop Express server
    });

    test("Should create a new order", async () => {
        const ol = new OrderLineJson(0, 1, 10, 0.4);
        const date = new Date();

        const response = await request(app)
            .post("/api/orders")
            .send({
                id: null,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.BUY,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 4,
                date: date,
                orderLines: [ol]
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.customerId).toEqual(customer.getId());
        expect(response.body.supplierId).toEqual(supplier.getId());
        expect(response.body.orderType).toEqual(OrderTypeEnum.BUY);
        expect(response.body.orderStatus).toEqual(OrderStatusEnum.CONFIRMED);
        expect(Number(response.body.totalPrice)).toEqual(4);
        expect(new Date(response.body.date)).toEqual(date);

        expect(response.body.orderLines[0].orderId).toEqual(response.body.id);
        expect(response.body.orderLines[0].productId).toEqual(ol.getProductId());
        expect(response.body.orderLines[0].quantity).toEqual(ol.getQuantity());
        expect(Number(response.body.orderLines[0].unitPrice)).toEqual(ol.getUnitPrice());

        orderId = response.body.id;
    });

    test("Should update an order", async () => {
        const ol = new OrderLineJson(0, 2, 50, 0.5);
        const date = new Date();

        const response = await request(app)
            .put(`/api/orders/${orderId}`)
            .send({
                id: orderId,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.SELL,
                orderStatus: OrderStatusEnum.DELIVERED,
                totalPrice: 25,
                date: date,
                orderLines: [ol]
            });

        expect(response.status).toBe(200);
        expect(response.body.customerId).toEqual(customer.getId());
        expect(response.body.supplierId).toEqual(supplier.getId());
        expect(response.body.orderType).toEqual(OrderTypeEnum.SELL);
        expect(response.body.orderStatus).toEqual(OrderStatusEnum.DELIVERED);
        expect(Number(response.body.totalPrice)).toEqual(25);
        expect(new Date(response.body.date)).toEqual(date);

        expect(response.body.orderLines[0].orderId).toEqual(response.body.id);
        expect(response.body.orderLines[0].productId).toEqual(ol.getProductId());
        expect(response.body.orderLines[0].quantity).toEqual(ol.getQuantity());
        expect(Number(response.body.orderLines[0].unitPrice)).toEqual(ol.getUnitPrice());
    });
});
