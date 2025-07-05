import {ShippingJson} from "../model/KeynoyModels";
import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {createShipping, deleteShipping, fetchShipping, updateShipping} from "../api/ShippingApi";
import {useOrdersContext} from "./OrdersContext";
import {useExpensesContext} from "./ExpensesContext";

interface ShippingContextValue {
    shippings: ShippingJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addShipping: (shippingJson: ShippingJson) => Promise<void>;
    editShipping: (shippingJson: ShippingJson) => Promise<void>;
    removeShipping: (shippingJson: ShippingJson) => Promise<void>;
}

const ShippingContext = createContext<ShippingContextValue | undefined>(undefined);

export const useShippingContext = (): ShippingContextValue => {
    const context = useContext(ShippingContext);
    if (!context) {
        throw new Error("useShippingContext must be used within a ShippingProvider");
    }
    return context;
}

export const ShippingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [shippings, setShippings] = useState<ShippingJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const {refresh: refreshOrders} = useOrdersContext();
    const {refresh: refreshExpenses} = useExpensesContext();

    const addShipping = async (shippingJson: ShippingJson) => {
        await createShipping(shippingJson);
        await refresh();
    };

    const editShipping = async (shippingJson: ShippingJson) => {
        await updateShipping(shippingJson);
        await refresh();
    };

    const removeShipping = async (shippingJson: ShippingJson) => {
        await deleteShipping(shippingJson);
        await refresh();
    };

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            await refreshOrders();
            await refreshExpenses();
            const data = await fetchShipping();
            setShippings(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const value: ShippingContextValue = useMemo(() => ({
        shippings,
        loading,
        error,
        refresh,
        addShipping,
        editShipping,
        removeShipping,
    }), [shippings, loading, error]);

    return <ShippingContext.Provider value={value}>{children}</ShippingContext.Provider>;
}