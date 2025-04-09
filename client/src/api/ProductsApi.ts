import {ProductJson} from "../model/KeynoyModels";

export const fetchProducts = async (): Promise<ProductJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch products');
    }
    return res.json();
};

export const createProduct = async (productType: ProductJson): Promise<ProductJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productType),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create product type');
    }
    return res.json();
};

export const updateProduct = async (productType: ProductJson): Promise<ProductJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productType.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productType),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product type');
    }
    return res.json();
};

export const deleteProduct = async (productType: ProductJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productType.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product type');
    }
};
