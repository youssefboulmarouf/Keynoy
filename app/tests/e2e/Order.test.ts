import request from "supertest";
import { app, stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, getEntity, updateEntity} from "./TestHelper";
import {CustomerJson} from "../../src/customer/CustomerJson";
import {SupplierJson} from "../../src/supplier/SupplierJson";
import {OrderTypeEnum} from "../../src/order/OrderTypeEnum";
import {OrderStatusEnum} from "../../src/order/OrderStatusEnum";
import {OrderLineJson} from "../../src/order/OrderLineJson";
import {ProductJson} from "../../src/product/ProductJson";

const prisma = new PrismaClient();

// TODO: add 404 & 400 test cases
describe("Order API E2E Tests", () => {
    let customer: CustomerJson;
    let supplier: SupplierJson;
    let product: ProductJson;
    let orderId: number;
    let orderDate: Date;
    let ol: OrderLineJson;
    const initialProductQuantity = 100;
    const addedProductQuantity = 10;
    const updatedProductQuantity = 10;

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

        const productResponse = await createEntity(
            "/api/products",
            { id: null, name: "productXero", size: "SizeXero", productTypeId: 1, color: "red", threshold: 0, totalQuantity: initialProductQuantity }
        )
        product = ProductJson.from(productResponse.body);
    })

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should create a new order", async () => {
        ol = new OrderLineJson(0, product.getId(), addedProductQuantity, 0.4);
        orderDate = new Date();

        const response = await createEntity(
            "/api/orders",
            {
                id: null,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.BUY,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 4,
                date: orderDate,
                orderLines: [ol]
            }
        );

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.id).not.toBeNull();
        expect(response.body.customerId).toEqual(customer.getId());
        expect(response.body.supplierId).toEqual(supplier.getId());
        expect(response.body.orderType).toEqual(OrderTypeEnum.BUY);
        expect(response.body.orderStatus).toEqual(OrderStatusEnum.CONFIRMED);
        expect(Number(response.body.totalPrice)).toEqual(4);
        expect(new Date(response.body.date)).toEqual(orderDate);

        expect(response.body.orderLines[0].orderId).toEqual(response.body.id);
        expect(response.body.orderLines[0].productId).toEqual(ol.getProductId());
        expect(response.body.orderLines[0].quantity).toEqual(ol.getQuantity());
        expect(Number(response.body.orderLines[0].unitPrice)).toEqual(ol.getUnitPrice());

        orderId = response.body.id;
    });

    test("Should create a new expense after a buy order", async () => {
        const expenseResponse = await getEntity("/api/expenses");
        expect(expenseResponse.status).toBe(200);
        expect(expenseResponse.body.length).toEqual(1);
        expect(expenseResponse.body[0].name).toEqual("Buy Order");
        expect(expenseResponse.body[0].totalPrice).toEqual(4);
        expect(new Date(expenseResponse.body[0].date)).toEqual(orderDate);
        expect(expenseResponse.body[0].orderId).toEqual(orderId);
        expect(expenseResponse.body[0].deliveryId).toEqual(0);
    })

    test("Should increase product quantity after a buy order", async () => {
        const productResponse = await getEntity(`/api/products/${product.getId()}`);
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.name).toEqual(product.getName());
        expect(productResponse.body.totalQuantity).toEqual(initialProductQuantity + addedProductQuantity);
    })

    test("Should update an order", async () => {
        ol = new OrderLineJson(0, product.getId(), updatedProductQuantity, 0.5);
        const date = new Date();

        const response = await updateEntity(`/api/orders/${orderId}`,
            {
                id: orderId,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.SELL,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 25,
                date: date,
                orderLines: [ol]
            }
        );

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(orderId);
        expect(response.body.customerId).toEqual(customer.getId());
        expect(response.body.supplierId).toEqual(supplier.getId());
        expect(response.body.orderType).toEqual(OrderTypeEnum.SELL);
        expect(response.body.orderStatus).toEqual(OrderStatusEnum.CONFIRMED);
        expect(Number(response.body.totalPrice)).toEqual(25);
        expect(new Date(response.body.date)).toEqual(date);

        expect(response.body.orderLines[0].orderId).toEqual(response.body.id);
        expect(response.body.orderLines[0].productId).toEqual(ol.getProductId());
        expect(response.body.orderLines[0].quantity).toEqual(ol.getQuantity());
        expect(Number(response.body.orderLines[0].unitPrice)).toEqual(ol.getUnitPrice());

        orderDate = new Date(response.body.date);
    });

    test("Should get 400 when order id mismatch", async () => {
        const response = await updateEntity(`/api/orders/99`,
            {
                id: orderId,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.SELL,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 25,
                date: new Date(),
                orderLines: []
            }
        );

        expect(response.status).toBe(400);
    })

    test("Should get 400 when update empty order lines", async () => {
        const response = await updateEntity(`/api/orders/${orderId}`,
            {
                id: orderId,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.SELL,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 25,
                date: new Date(),
                orderLines: []
            }
        );

        expect(response.status).toBe(400);
    })

    test("Should remove expense after a updating buy order to sell order", async () => {
        const expenseResponse = await getEntity("/api/expenses");
        expect(expenseResponse.status).toBe(200);
        expect(expenseResponse.body.length).toEqual(0);
    })

    test("Should decrease product quantity after after a updating buy order to sell order", async () => {
        const productResponse = await getEntity(`/api/products/${product.getId()}`);
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.name).toEqual(product.getName());
        expect(productResponse.body.totalQuantity).toEqual(initialProductQuantity - updatedProductQuantity);
    })

    test("Should get an order by id", async () => {
        const response = await getEntity(`/api/orders/${orderId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toEqual(orderId);
        expect(response.body.customerId).toEqual(customer.getId());
        expect(response.body.supplierId).toEqual(supplier.getId());
        expect(response.body.orderType).toEqual(OrderTypeEnum.SELL);
        expect(response.body.orderStatus).toEqual(OrderStatusEnum.CONFIRMED);
        expect(Number(response.body.totalPrice)).toEqual(25);
        expect(new Date(response.body.date)).toEqual(orderDate);

        expect(response.body.orderLines[0].orderId).toEqual(orderId);
        expect(response.body.orderLines[0].productId).toEqual(ol.getProductId());
        expect(response.body.orderLines[0].quantity).toEqual(ol.getQuantity());
        expect(Number(response.body.orderLines[0].unitPrice)).toEqual(ol.getUnitPrice());
    });

    test("Should get 404 when order id not found", async () => {
        const response = await getEntity(`/api/orders/99`);
        expect(response.status).toBe(404);
    });

    test("Should get 400 when order lines is empty", async () => {
        const response = await createEntity(
            "/api/orders",
            {
                id: null,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.BUY,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 4,
                date: new Date(),
                orderLines: []
            }
        );

        expect(response.status).toBe(400);
    });
});
