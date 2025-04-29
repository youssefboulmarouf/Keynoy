import {ProductVariationJson} from "../model/KeynoyModels";

export const fetchProductVariations = async (): Promise<ProductVariationJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-variations`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch products');
    }
    return res.json();
};

export const createProductVariation = async (productVariationJson: ProductVariationJson): Promise<ProductVariationJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-variations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productVariationJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create product');
    }
    return res.json();
};

export const updateProductVariation = async (productVariationJson: ProductVariationJson): Promise<ProductVariationJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-variations/${productVariationJson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productVariationJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product');
    }
    return res.json();
};

export const deleteProductVariation = async (productVariationJson: ProductVariationJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/product-variations/${productVariationJson.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete product');
    }
};
