import {ShippingJson} from "../model/KeynoyModels";

export const fetchShipping = async (): Promise<ShippingJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/shipping`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch shipping');
    }
    return res.json();
}

export const createShipping = async (shipping: ShippingJson): Promise<ShippingJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/shipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipping),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create shipping');
    }
    return res.json();
};

export const updateShipping = async (shipping: ShippingJson): Promise<ShippingJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/shipping/${shipping.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipping),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update shipping');
    }
    return res.json();
};

export const deleteShipping = async (shipping: ShippingJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/shipping/${shipping.orderId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete shipping');
    }
};