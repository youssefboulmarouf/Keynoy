import React, {useEffect, useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Container, Grid} from "@mui/material";
import Box from "@mui/material/Box";
import DashboardTopCards from "./DashboardTopCards";
import {useOrdersContext} from "../../context/OrdersContext";
import {useExpensesContext} from "../../context/ExpensesContext";
import {ExpenseJson, OrderJson, OrderTypeEnum} from "../../model/KeynoyModels";
import StatsChart from "./StatsChart";
import DashboardStatCharts from "./DashboardStatCharts";

const Dashboard: React.FC = () => {
    const {orders} = useOrdersContext();
    const {expenses} = useExpensesContext();

    const [ordersByMonth, setOrdersByMonth] = useState<Map<string, OrderJson[]>>(new Map<string, OrderJson[]>());
    const [expensesByMonth, setExpensesByMonth] = useState<Map<string, ExpenseJson[]>>(new Map<string, ExpenseJson[]>());

    useEffect(() => {
        setOrdersByMonth(groupOrdersByMonth(orders));
    }, [orders]);

    useEffect(() => {
        setExpensesByMonth(groupExpensesByMonth(expenses));
    }, [expenses]);

    const groupOrdersByMonth = (orders: OrderJson[]): Map<string, OrderJson[]> => {
        const map = new Map<string, OrderJson[]>();

        for (const order of orders) {
            if (order.orderType === OrderTypeEnum.SELL) {
                const date = new Date(order.date);
                const key = `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

                if (!map.has(key)) {
                    map.set(key, []);
                }
                map.get(key)!.push(order);
            }
        }

        return map;
    }

    const groupExpensesByMonth = (expenses: ExpenseJson[]): Map<string, ExpenseJson[]> => {
        const map = new Map<string, ExpenseJson[]>();

        for (const expense of expenses) {
            const date = new Date(expense.date);
            const key = `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(expense);
        }

        return map;
    }

    return (
        <Box>
            {/*Add Critical Variations*/}
            <Grid container spacing={3}>
                <DashboardTopCards ordersByMonth={ordersByMonth} expensesByMonth={expensesByMonth}/>
            </Grid>

            <Grid container spacing={1} mt={3}>
                <DashboardStatCharts ordersByMonth={ordersByMonth} expensesByMonth={expensesByMonth}/>
            </Grid>
        </Box>
    );
};

export default Dashboard;
