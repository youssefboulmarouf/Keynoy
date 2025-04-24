
import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {ProductJson} from "../model/KeynoyModels";
import {createProduct, deleteProduct, fetchProducts, updateProduct} from "../api/ProductsApi";

interface ProductsContextValue {
    products: ProductJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addProduct: (product: ProductJson) => void;
    editProduct: (product: ProductJson) => void;
    removeProduct: (product: ProductJson) => void;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export const useProductsContext = (): ProductsContextValue => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProductsContext must be used within a ProductsProvider");
    }
    return context;
}

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<ProductJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addProduct = async (product: ProductJson) => {
        await createProduct(product);
        await refresh();
    };

    const editProduct = async (product: ProductJson) => {
        await updateProduct(product);
        await refresh();
    };

    const removeProduct = async (product: ProductJson) => {
        await deleteProduct(product);
        await refresh();
    };

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const value: ProductsContextValue = useMemo(() => ({
        products,
        loading,
        error,
        refresh,
        addProduct,
        editProduct,
        removeProduct
    }), [products, loading, error]);

    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}