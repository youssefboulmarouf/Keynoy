import {ExpenseJson} from "../model/KeynoyModels";

export const fetchExpenses = async (): Promise<ExpenseJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expenses`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch expenses');
    }
    return res.json();
};

export const createExpense = async (expenseJson: ExpenseJson): Promise<ExpenseJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create expense');
    }
    return res.json();
};

export const updateExpense = async (expenseJson: ExpenseJson): Promise<ExpenseJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expenses/${expenseJson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update expense');
    }
    return res.json();
};

export const deleteExpense = async (expenseJson: ExpenseJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expenses/${expenseJson.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete expense');
    }
};
