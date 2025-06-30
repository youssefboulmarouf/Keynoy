import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {ExpenseJson} from "../model/KeynoyModels";
import {createExpense, deleteExpense, fetchExpenses, updateExpense} from "../api/ExpensesApi";

interface ExpensesContextValue {
    expenses: ExpenseJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addExpense: (expenseJson: ExpenseJson) => void;
    editExpense: (expenseJson: ExpenseJson) => void;
    removeExpense: (expenseJson: ExpenseJson) => void;
}

const ExpensesContext = createContext<ExpensesContextValue | undefined>(undefined);

export const useExpensesContext = (): ExpensesContextValue => {
    const context = useContext(ExpensesContext);
    if (!context) {
        throw new Error("useExpensesContext must be used within a ExpensesProvider");
    }
    return context;
};

export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = React.useState<ExpenseJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addExpense = async (expenseJson: ExpenseJson) => {
        await createExpense(expenseJson);
        await refresh();
    }

    const editExpense = async (expenseJson: ExpenseJson) => {
        await updateExpense(expenseJson);
        await refresh();
    }

    const removeExpense = async (expenseJson: ExpenseJson) => {
        await deleteExpense(expenseJson);
        await refresh();
    }

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchExpenses();
            setExpenses(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const value: ExpensesContextValue = useMemo(() => ({
        expenses,
        loading,
        error,
        refresh,
        addExpense,
        editExpense,
        removeExpense,
    }), [expenses, loading, error]);

    return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}