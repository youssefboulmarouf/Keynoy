import { stopServer } from "../../src";
import { PrismaClient } from "@prisma/client";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";
import {CustomerJson} from "../../src/customer/CustomerJson";
import {SupplierJson} from "../../src/supplier/SupplierJson";
import {OrderTypeEnum} from "../../src/order/OrderTypeEnum";
import {OrderStatusEnum} from "../../src/order/OrderStatusEnum";
import {OrderLineJson} from "../../src/order/OrderLineJson";
import {ProductJson} from "../../src/product/ProductJson";

const prisma = new PrismaClient();

describe("Order API E2E Tests", () => {
    let customer: CustomerJson;
    let supplier: SupplierJson;
    let product: ProductJson;
    let orderId: number;
    let orderDate: Date;
    let ol: OrderLineJson;
    const initialProductQuantity = 100;
    const boughtProductQuantity = 20;
    const soldProductQuantity = 10;

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

    test("Should get 400 when order status is not confirmed", async () => {
        const response = await createEntity(
            "/api/orders",
            {
                id: null,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.BUY,
                orderStatus: OrderStatusEnum.SHIPPED,
                totalPrice: 4,
                date: new Date(),
                orderLines: [new OrderLineJson(0, 0, 0, 0)]
            }
        );

        expect(response.status).toBe(400);
    });

    test("Should create a new sell order", async () => {
        ol = new OrderLineJson(0, product.getId(), soldProductQuantity, 0.4);
        orderDate = new Date();

        const response = await createEntity(
            "/api/orders",
            {
                id: null,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.SELL,
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
        expect(response.body.orderType).toEqual(OrderTypeEnum.SELL);
        expect(response.body.orderStatus).toEqual(OrderStatusEnum.CONFIRMED);
        expect(Number(response.body.totalPrice)).toEqual(4);
        expect(new Date(response.body.date)).toEqual(orderDate);

        expect(response.body.orderLines[0].orderId).toEqual(response.body.id);
        expect(response.body.orderLines[0].productId).toEqual(ol.getProductId());
        expect(response.body.orderLines[0].quantity).toEqual(ol.getQuantity());
        expect(Number(response.body.orderLines[0].unitPrice)).toEqual(ol.getUnitPrice());

        orderId = response.body.id;
    });

    test("Should not create a new expense after a sell order", async () => {
        const expenseResponse = await getEntity("/api/expenses");
        expect(expenseResponse.status).toBe(200);
        expect(expenseResponse.body.length).toEqual(0);
    })

    test("Should decrease product quantity after a sell order", async () => {
        const productResponse = await getEntity(`/api/products/${product.getId()}`);
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.name).toEqual(product.getName());
        expect(productResponse.body.totalQuantity).toEqual(initialProductQuantity - soldProductQuantity);
    })

    test("Should create a new buy order", async () => {
        ol = new OrderLineJson(0, product.getId(), boughtProductQuantity, 0.4);
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
    });

    test("Should increase product quantity after a buy order", async () => {
        const productResponse = await getEntity(`/api/products/${product.getId()}`);
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.name).toEqual(product.getName());
        expect(productResponse.body.totalQuantity).toEqual(initialProductQuantity - soldProductQuantity + boughtProductQuantity);
    });

    test("Should get 400 updating order with status higher than FINISHED", async () => {
        const response = await updateEntity(`/api/orders/${orderId}/status/${OrderStatusEnum.DELIVERED}`,{});
        expect(response.status).toBe(400);
    });

    test("Should update order status", async () => {
        const response = await updateEntity(`/api/orders/${orderId}/status/${OrderStatusEnum.FINISHED}`,{});
        expect(response.status).toBe(201);

        const getResponse = await getEntity(`/api/orders/${orderId}`);
        expect(getResponse.body.id).toEqual(orderId);
        expect(getResponse.body.orderStatus).toEqual(OrderStatusEnum.FINISHED);
    });

    test("Should get 400 if updating order with lower status", async () => {
        const response = await updateEntity(`/api/orders/${orderId}/status/${OrderStatusEnum.IN_PROGRESS}`,{});
        expect(response.status).toBe(400);
    });

    test("Should get 404 when updating non existing order", async () => {
        const response = await updateEntity(`/api/orders/99/status/${OrderStatusEnum.IN_PROGRESS}`,{});
        expect(response.status).toBe(404);
    });

    test("Should get 500 if updating order with unknown status", async () => {
        const response = await updateEntity(`/api/orders/${orderId}/status/99`,{});
        expect(response.status).toBe(500);
    });

    test("Should get 404 if deleting non existing order", async () => {
        const response = await deleteEntity(`/api/orders/99`);
        expect(response.status).toBe(404);
    });

    test("Should get 404 deleting non confirmed order", async () => {
        const response = await deleteEntity(`/api/orders/${orderId}`);
        expect(response.status).toBe(400);
    });

    test("Should delete buy order and adjust product quantity and expense", async () => {
        const createProductResponse = await createEntity(
            "/api/products",
            { id: null, name: "new product", size: "Size", productTypeId: 1, color: "red", threshold: 0, totalQuantity: initialProductQuantity }
        )

        const newProduct = ProductJson.from(createProductResponse.body);

        const orderLine = new OrderLineJson(0, newProduct.getId(), boughtProductQuantity, 0.4);
        orderDate = new Date();

        const createOrderResponse = await createEntity(
            "/api/orders",
            {
                id: null,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.BUY,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 4,
                date: orderDate,
                orderLines: [orderLine]
            }
        );

        expect(createOrderResponse.status).toBe(201);
        expect(createOrderResponse.body).toHaveProperty("id");
        expect(createOrderResponse.body.id).not.toBeNull();

        const newOrderId = createOrderResponse.body.id;

        // Check product quantity increase
        let getProductResponse = await getEntity(`/api/products/${newProduct.getId()}`);
        expect(getProductResponse.status).toBe(200);
        expect(getProductResponse.body.name).toEqual(newProduct.getName());
        expect(getProductResponse.body.totalQuantity).toEqual(initialProductQuantity + boughtProductQuantity);

        // Check expense
        let expenseResponse = await getEntity("/api/expenses");
        expect(expenseResponse.status).toBe(200);
        expect(expenseResponse.body.length).toBeGreaterThan(1);
        let expense = expenseResponse.body.filter((r: any) => r.orderId === newOrderId);
        expect(expense.length).toEqual(1);

        // Delete Order
        const deleteOrderResponse = await deleteEntity(`/api/orders/${newOrderId}`);
        expect(deleteOrderResponse.status).toBe(204);

        // Check product quantity decrease
        getProductResponse = await getEntity(`/api/products/${newProduct.getId()}`);
        expect(getProductResponse.status).toBe(200);
        expect(getProductResponse.body.name).toEqual(newProduct.getName());
        expect(getProductResponse.body.totalQuantity).toEqual(initialProductQuantity);

        // Check expense
        expenseResponse = await getEntity("/api/expenses");
        expect(expenseResponse.status).toBe(200);
        expect(expenseResponse.body.length).toEqual(1);
        expense = expenseResponse.body.filter((r: any) => r.orderId === newOrderId);
        expect(expense.length).toEqual(0);
    });

    test("Should delete sell order and adjust product quantity with no expense", async () => {
        const createProductResponse = await createEntity(
            "/api/products",
            { id: null, name: "new product", size: "Size", productTypeId: 1, color: "red", threshold: 0, totalQuantity: initialProductQuantity }
        )

        const newProduct = ProductJson.from(createProductResponse.body);

        const orderLine = new OrderLineJson(0, newProduct.getId(), soldProductQuantity, 0.4);
        orderDate = new Date();

        const createOrderResponse = await createEntity(
            "/api/orders",
            {
                id: null,
                customerId: customer.getId(),
                supplierId: supplier.getId(),
                orderType: OrderTypeEnum.SELL,
                orderStatus: OrderStatusEnum.CONFIRMED,
                totalPrice: 4,
                date: orderDate,
                orderLines: [orderLine]
            }
        );

        expect(createOrderResponse.status).toBe(201);
        expect(createOrderResponse.body).toHaveProperty("id");
        expect(createOrderResponse.body.id).not.toBeNull();

        const newOrderId = createOrderResponse.body.id;

        // Check product quantity increase
        let getProductResponse = await getEntity(`/api/products/${newProduct.getId()}`);
        expect(getProductResponse.status).toBe(200);
        expect(getProductResponse.body.name).toEqual(newProduct.getName());
        expect(getProductResponse.body.totalQuantity).toEqual(initialProductQuantity - soldProductQuantity);

        // Check expense
        let expenseResponse = await getEntity("/api/expenses");
        expect(expenseResponse.status).toBe(200);
        expect(expenseResponse.body.length).toEqual(1);
        let expense = expenseResponse.body.filter((r: any) => r.orderId === newOrderId);
        expect(expense.length).toEqual(0);

        // Delete Order
        const deleteOrderResponse = await deleteEntity(`/api/orders/${newOrderId}`);
        expect(deleteOrderResponse.status).toBe(204);

        // Check product quantity decrease
        getProductResponse = await getEntity(`/api/products/${newProduct.getId()}`);
        expect(getProductResponse.status).toBe(200);
        expect(getProductResponse.body.name).toEqual(newProduct.getName());
        expect(getProductResponse.body.totalQuantity).toEqual(initialProductQuantity);
    });
});
