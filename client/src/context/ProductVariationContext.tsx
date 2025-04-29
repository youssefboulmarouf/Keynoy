import {ProductVariationJson} from "../model/KeynoyModels";
import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {
    createProductVariation,
    deleteProductVariation,
    fetchProductVariations,
    updateProductVariation
} from "../api/ProductVariationsApi";

interface ProductVariationContextValue {
    variations: ProductVariationJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addVariant: (variant: ProductVariationJson) => void;
    editVariant: (variant: ProductVariationJson) => void;
    removeVariant: (variant: ProductVariationJson) => void;
}

const ProductVariationContext = createContext<ProductVariationContextValue | undefined>(undefined);

export const useProductVariationContext = (): ProductVariationContextValue => {
    const context = useContext(ProductVariationContext);
    if (!context) {
        throw new Error("useProductVariationContext must be used within a ProductVariationProvider");
    }
    return context;
}

export const ProductVariationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [variations, setVariations] = useState<ProductVariationJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addVariant = async (variant: ProductVariationJson) => {
        await createProductVariation(variant);
        await refresh();
    }

    const editVariant = async (variant: ProductVariationJson) => {
        await updateProductVariation(variant);
        await refresh();
    }

    const removeVariant = async (variant: ProductVariationJson) => {
        await deleteProductVariation(variant);
        await refresh();
    }

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProductVariations();
            setVariations(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    const value: ProductVariationContextValue = useMemo(() => ({
        variations,
        loading,
        error,
        refresh,
        addVariant,
        editVariant,
        removeVariant
    }), [variations, loading, error])

    return <ProductVariationContext.Provider value={value}>{ children }</ProductVariationContext.Provider>
}