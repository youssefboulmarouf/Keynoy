import {ProductTypeJson} from "../model/KeynoyModels";

export const fetchProductTypes = async (): Promise<ProductTypeJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-types`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch product types');
    };
    return res.json();
};

export const createProductType = async (productType: ProductTypeJson): Promise<ProductTypeJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-types`, {
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

export const updateProductType = async (productType: ProductTypeJson): Promise<ProductTypeJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-types/${productType.id}`, {
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

export const deleteProductType = async (productType: ProductTypeJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-types/${productType.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product type');
    }
    return res.json();
};
