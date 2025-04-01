import {PrismaClient} from "@prisma/client";
import {stopServer} from "../../src";
import {createEntity, deleteEntity, getEntity, updateEntity} from "./TestHelper";
import {CustomerJson} from "../../src/customer/CustomerJson";
import {SupplierJson} from "../../src/supplier/SupplierJson";
import {ProductJson} from "../../src/product/ProductJson";
import {OrderTypeEnum} from "../../src/order/OrderTypeEnum";
import {OrderStatusEnum} from "../../src/order/OrderStatusEnum";
import {OrderLineJson} from "../../src/order/OrderLineJson";
import {DeliveryCompanyJson} from "../../src/delivery/DeliveryCompanyJson";

const prisma = new PrismaClient();

describe("Order API E2E Tests", () => {
    let customer: CustomerJson;
    let supplier: SupplierJson;
    let product: ProductJson;
    let deliveryCompany: DeliveryCompanyJson;
    let orderDate: Date;
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

        const productResponse = await createEntity(
            "/api/products",
            { id: null, name: "productXero", size: "SizeXero", productTypeId: 1, color: "red", threshold: 0, totalQuantity: 100 }
        )
        product = ProductJson.from(productResponse.body);

        const dc = await getEntity(`/api//delivery-companies`);
        deliveryCompany = DeliveryCompanyJson.from(dc.body[0]);

        orderDate = new Date();
        const orderLine = new OrderLineJson(0, product.getId(), 50, 0.4);
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
        orderId = createOrderResponse.body.id;
    })

    afterAll(async () => {
        await prisma.$disconnect();
        stopServer();
    });

    test("Should get 400 when shipping order with status lower than finished", async () => {
        const shippingResponse = await createEntity(`/api/shipping/`, {
            orderId: orderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 1
        });

        expect(shippingResponse.status).toBe(400);
    });

    test("Should get 400 when shipping id mismatch", async () => {
        const shippingResponse = await updateEntity(`/api/shipping/99`, {
            orderId: orderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 1
        });

        expect(shippingResponse.status).toBe(400);
    });

    test("Should get 400 when shipping buy order", async () => {
        const orderLine = new OrderLineJson(0, product.getId(), 10, 0.4);
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
        const newOrderId = createOrderResponse.body.id;

        const updateResponse = await updateEntity(`/api/orders/${newOrderId}/status/${OrderStatusEnum.FINISHED}`,{});
        expect(updateResponse.status).toBe(201);

        const deliveryResponse = await createEntity(`/api/shipping/`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 1
        });

        expect(deliveryResponse.status).toBe(400);
    });

    test("Should ship order", async () => {
        const updateResponse = await updateEntity(`/api/orders/${orderId}/status/${OrderStatusEnum.FINISHED}`,{});
        expect(updateResponse.status).toBe(201);

        const shippingResponse = await createEntity(`/api/shipping/`, {
            orderId: orderId,
            dcId: deliveryCompany.getId(),
            shippingDate: orderDate,
            deliveryDate: orderDate,
            price: 10
        });
        expect(shippingResponse.status).toBe(201);
        expect(shippingResponse.body.orderId).toEqual(orderId);
        expect(shippingResponse.body.dcId).toEqual(deliveryCompany.getId());
        expect(new Date(shippingResponse.body.shippingDate)).toEqual(orderDate);
        expect(shippingResponse.body.deliveryDate).toEqual(null);
        expect(shippingResponse.body.price).toEqual(10);

        const getOrderResponse = await getEntity(`/api/orders/${orderId}`);
        expect(getOrderResponse.status).toBe(200);
        expect(getOrderResponse.body.orderStatus).toEqual(OrderStatusEnum.SHIPPED);
    });

    test("Should update shipping details", async () => {
        const newDate = new Date();
        const dc = await getEntity(`/api/delivery-companies`);
        const newDeliveryCompany = DeliveryCompanyJson.from(dc.body[1]);

        const shippingResponse = await updateEntity(`/api/shipping/${orderId}`, {
            orderId: orderId,
            dcId: newDeliveryCompany.getId(),
            shippingDate: orderDate,
            deliveryDate: newDate,
            price: 50
        });

        expect(shippingResponse.status).toBe(201);

        const response = await getEntity(`/api/shipping/${orderId}`);
        expect(response.body.orderId).toEqual(orderId);
        expect(response.body.dcId).toEqual(newDeliveryCompany.getId());
        expect(new Date(response.body.shippingDate)).toEqual(orderDate);
        expect(response.body.deliveryDate).toEqual(null);
        expect(response.body.price).toEqual(50);
    });

    test("Should get 400 when updating delivered order", async () => {
        const orderLine = new OrderLineJson(0, product.getId(), 10, 0.4);
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
        const newOrderId = createOrderResponse.body.id;

        const updateResponse = await updateEntity(`/api/orders/${newOrderId}/status/${OrderStatusEnum.FINISHED}`,{});
        expect(updateResponse.status).toBe(201);

        const shippingResponse = await createEntity(`/api/shipping/`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(shippingResponse.status).toBe(201);

        const deliveredResponse = await updateEntity(`/api/shipping/${newOrderId}/delivered`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(deliveredResponse.status).toBe(201);

        const updateDeliveredResponse = await updateEntity(`/api/shipping/${newOrderId}`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(updateDeliveredResponse.status).toBe(400);
    });

    test("Should get 400 when deleting delivered order", async () => {
        const orderLine = new OrderLineJson(0, product.getId(), 10, 0.4);
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
        const newOrderId = createOrderResponse.body.id;

        const updateResponse = await updateEntity(`/api/orders/${newOrderId}/status/${OrderStatusEnum.FINISHED}`,{});
        expect(updateResponse.status).toBe(201);

        const shippingResponse = await createEntity(`/api/shipping/`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(shippingResponse.status).toBe(201);

        const deliveredResponse = await updateEntity(`/api/shipping/${newOrderId}/delivered`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(deliveredResponse.status).toBe(201);

        const deleteDeliveredResponse = await deleteEntity(`/api/shipping/${newOrderId}`);
        expect(deleteDeliveredResponse.status).toBe(400);
    });

    test("Should deleting shipping details when order is shipped", async () => {
        const orderLine = new OrderLineJson(0, product.getId(), 10, 0.4);
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
        const newOrderId = createOrderResponse.body.id;

        const updateResponse = await updateEntity(`/api/orders/${newOrderId}/status/${OrderStatusEnum.FINISHED}`,{});
        expect(updateResponse.status).toBe(201);

        const shippingResponse = await createEntity(`/api/shipping/`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(shippingResponse.status).toBe(201);

        const deleteDeliveredResponse = await deleteEntity(`/api/shipping/${newOrderId}`);
        expect(deleteDeliveredResponse.status).toBe(204);

        const orderResponse = await getEntity(`/api/orders/${newOrderId}`);
        expect(orderResponse.body.orderStatus).toEqual(OrderStatusEnum.FINISHED);
    });

    test("Should get 400 when delivering order with id mismatch", async () => {
        const deliveredResponse = await updateEntity(`/api/shipping/99/delivered`, {
            orderId: orderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(deliveredResponse.status).toBe(400)
    });

    test("Should get 400 when delivering none shipped order", async () => {
        const orderLine = new OrderLineJson(0, product.getId(), 10, 0.4);
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
        const newOrderId = createOrderResponse.body.id;

        const updateResponse = await updateEntity(`/api/orders/${newOrderId}/status/${OrderStatusEnum.FINISHED}`,{});
        expect(updateResponse.status).toBe(201);

        const deliveredResponse = await updateEntity(`/api/shipping/${newOrderId}/delivered`, {
            orderId: newOrderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: new Date(),
            price: 0
        });
        expect(deliveredResponse.status).toBe(400);
    });

    test("Should add expense when delivering order", async () => {
        const deliveryDate = new Date();
        const deliveredResponse = await updateEntity(`/api/shipping/${orderId}/delivered`, {
            orderId: orderId,
            dcId: deliveryCompany.getId(),
            shippingDate: new Date(),
            deliveryDate: deliveryDate,
            price: 10
        });
        expect(deliveredResponse.status).toBe(201);

        const expenseResponse = await getEntity(`/api/expenses/`);
        const expenses = expenseResponse.body.filter((res: any) => res.orderId == orderId)
        expect(expenses.length).toEqual(1);
        expect(expenses[0].orderId).toEqual(orderId);
        expect(expenses[0].totalPrice).toEqual(50);
        expect(new Date(expenses[0].date)).toEqual(deliveryDate);
    });
})