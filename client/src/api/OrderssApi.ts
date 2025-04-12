import {OrderJson} from "../model/KeynoyModels";

export const fetchOrders = async (): Promise<OrderJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch orders');
    }
    return res.json();
};

export const createOrder = async (orderJson: OrderJson): Promise<OrderJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create order');
    }
    return res.json();
};

export const updateOrder = async (orderJson: OrderJson): Promise<OrderJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderJson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update order');
    }
    return res.json();
};

export const deleteOrder = async (orderJson: OrderJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${orderJson.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete order');
    }
};
