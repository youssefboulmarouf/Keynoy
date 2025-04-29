import {ProductTypeJson} from "../model/KeynoyModels";
import React, {createContext, useContext, useEffect, useState, ReactNode, useMemo} from "react";
import {createProductType, deleteProductType, fetchProductTypes, updateProductType} from "../api/ProductTypesApi";

interface ProductTypesContextValue {
    productTypes: ProductTypeJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addProductType: (productType: ProductTypeJson) => void;
    editProductType: (productType: ProductTypeJson) => void;
    removeProductType: (productType: ProductTypeJson) => void;
}

const ProductTypesContext = createContext<ProductTypesContextValue | undefined>(undefined);

export const useProductTypesContext = (): ProductTypesContextValue => {
    const context = useContext(ProductTypesContext);
    if (!context) {
        throw new Error("useProductTypesContext must be used within a ProductTypesProvider");
    }
    return context;
};

export const ProductTypesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [productTypes, setProductTypes] = useState<ProductTypeJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addProductType = async (productType: ProductTypeJson) => {
        await createProductType(productType);
    };

    const editProductType = async (productType: ProductTypeJson) => {
        await updateProductType(productType);
    };

    const removeProductType = async (productType: ProductTypeJson) => {
        await deleteProductType(productType);
    };

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProductTypes();
            setProductTypes(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const value: ProductTypesContextValue = useMemo(() => ({
        productTypes,
        loading,
        error,
        refresh,
        addProductType,
        editProductType,
        removeProductType,
    }), [productTypes, loading, error, addProductType, editProductType, removeProductType]);

    return <ProductTypesContext.Provider value={value}>{children}</ProductTypesContext.Provider>;
};

