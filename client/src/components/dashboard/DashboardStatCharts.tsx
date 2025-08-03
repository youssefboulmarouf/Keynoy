import StatsChart from "./StatsChart";
import {ExpenseJson, OrderJson, OrderStatusEnum} from "../../model/KeynoyModels";
import {Card, CardContent, CardHeader, Grid} from "@mui/material";
import {useEffect, useState} from "react";
import Divider from "@mui/material/Divider";
import MultyStatsChartChart from "./MultyStatsChart";

interface DashboardStatChartsProps {
    ordersByMonth: Map<string, OrderJson[]>;
    expensesByMonth: Map<string, ExpenseJson[]>;
}

const DashboardStatCharts: React.FC<DashboardStatChartsProps> = ({
    ordersByMonth,
    expensesByMonth
}) => {
    const [revenueExpenseChartData, setRevenueExpenseChartData] = useState<Map<string, { income: number; expense: number }>>(new Map<string, { income: number; expense: number }>());
    const [revenueChartData, setRevenueChartData] = useState<Map<string, number>>(new Map<string, number>());
    const [expenseChartData, setExpenseChartData] = useState<Map<string, number>>(new Map<string, number>());

    useEffect(() => {
        const map = new Map<string, { income: number; expense: number }>();
        const dates = Array.from(ordersByMonth.keys());

        dates.forEach(date => {
            let income = 0;
            let expense = 0;

            if (ordersByMonth.has(date)) {
                income = ordersByMonth
                    ?.get(date)
                    ?.filter(o => o.orderStatus === OrderStatusEnum.DELIVERED)
                    .reduce((sum, o) => sum + o.totalPrice, 0) ?? 0;
            }
            if (expensesByMonth.has(date)) {
                expense = expensesByMonth.get(date)?.reduce((sum, e) => sum + e.totalPrice, 0) ?? 0;
            }
            map.set(date, {income, expense});
        });
        setRevenueExpenseChartData(map);
    }, [ordersByMonth, expenseChartData]);

    useEffect(() => {
        const map = new Map<string, number>();
        ordersByMonth.forEach((orders, month) => {
            const totalMonthlyRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
            map.set(month, totalMonthlyRevenue);
        });
        setRevenueChartData(map);
    }, [ordersByMonth]);

    useEffect(() => {
        const map = new Map<string, number>();
        expensesByMonth.forEach((expense, month) => {
            const totalMonthlyExpense = expense.reduce((sum, o) => sum + o.totalPrice, 0);
            map.set(month, totalMonthlyExpense);
        });
        setExpenseChartData(map);
    }, [expensesByMonth]);

    return (
        <>

            <Grid size={{xs: 12, sm: 12, md: 12, lg: 12}}>
                <MultyStatsChartChart cardTitle={"Revenues & Charges"} chartData={revenueExpenseChartData}/>
            </Grid>

            <Grid size={{xs: 12, sm: 12, md: 6, lg: 6}}>
                <StatsChart cardTitle={"Revenues Mensuelles"} chartName={"Revenues"} chartData={revenueChartData}/>
            </Grid>

            <Grid size={{xs: 12, sm: 12, md: 6, lg: 6}}>
                <StatsChart cardTitle={"Charges Mensuelles"} chartName={"Charges"} chartData={expenseChartData}/>
            </Grid>
        </>
    );
}

export default DashboardStatCharts;