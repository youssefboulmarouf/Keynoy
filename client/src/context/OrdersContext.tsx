import {OrderJson} from "../model/KeynoyModels";
import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {
    createOrder,
    deleteOrder,
    fetchOrders,
    syncOrderExpense,
    syncVariationInventory,
    updateOrder
} from "../api/OrdersApi";
import {useProductVariationContext} from "./ProductVariationContext";
import {useExpensesContext} from "./ExpensesContext";

interface OrdersContextValue {
    orders: OrderJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addOrder: (order: OrderJson) => void;
    editOrder: (order: OrderJson) => void;
    removeOrder: (order: OrderJson) => void;
    syncInventory: (order: OrderJson) => void;
    syncExpense: (order: OrderJson) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export const useOrdersContext = (): OrdersContextValue => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error("useOrdersContext must be used within a OrdersProvider");
    }
    return context;
}

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<OrderJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const {refresh: refreshVariations} = useProductVariationContext();
    const {refresh: refreshExpenses} = useExpensesContext();

    const addOrder = async (order: OrderJson) => {
        await createOrder(order)
        await refresh();
    }

    const editOrder = async (order: OrderJson) => {
        await updateOrder(order)
        await refresh();
    }

    const removeOrder = async (order: OrderJson) => {
        await deleteOrder(order);
        await refresh();
    }

    const syncInventory = async (order: OrderJson) => {
        await syncVariationInventory(order);
        await refresh();
        await refreshVariations();
    }

    const syncExpense = async (order: OrderJson) => {
        await syncOrderExpense(order);
        await refresh();
        await refreshExpenses();
    }

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchOrders();
            setOrders(data)
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    const value: OrdersContextValue = useMemo(() => ({
        orders,
        loading,
        error,
        refresh,
        addOrder,
        editOrder,
        removeOrder,
        syncInventory,
        syncExpense
    }), [orders, loading, error])

    return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}