import {Grid} from "@mui/material";
import DashboardCard from "./DashboardCard";
import {ExpenseJson, OrderJson, OrderStatusEnum} from "../../model/KeynoyModels";
import {useEffect, useState} from "react";
import {getCurrentMonthKey, getPastMonthKey} from "../common/Utilities";

interface DashboardTopCardsProps {
    ordersByMonth: Map<string, OrderJson[]>;
    expensesByMonth: Map<string, ExpenseJson[]>;
}

const DashboardTopCards: React.FC<DashboardTopCardsProps> = ({
    ordersByMonth,
    expensesByMonth
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false)
    }, [ordersByMonth, expensesByMonth]);

    const getMonthlyRevenue = (key: string): number => {
        if(ordersByMonth?.has(key)) {
            return ordersByMonth
                ?.get(key)
                ?.filter(o => o.orderStatus === OrderStatusEnum.DELIVERED)
                .reduce((sum, o) => sum + o.totalPrice, 0) ?? 0;
        }
        return 0
    }

    const getMonthlyExpenses = (key: string): number => {
        if(expensesByMonth?.has(key)) {
            return expensesByMonth
                ?.get(key)
                ?.reduce((sum, e) => sum + e.totalPrice, 0) ?? 0;
        }
        return 0;
    }

    const getMonthlySellOrdersCount = (key: string): number => {
        if(ordersByMonth?.has(key)) {
            return ordersByMonth
                ?.get(key)
                ?.length ?? 0;
        }
        return 0
    }

    const getMonthlyReturnedOrders = (key: string): number => {
        if(ordersByMonth?.has(key)) {
            return ordersByMonth
                ?.get(key)
                ?.filter(o => o.orderStatus === OrderStatusEnum.RETURNED).length ?? 0;
        }
        return 0
    }

    return (
        <>
            <Grid size={{xs: 12, sm: 6, md: 3, lg: 3}}>
                <DashboardCard
                    title="Revenues"
                    currentMonth={getCurrentMonthKey()}
                    currentMonthStats={getMonthlyRevenue(getCurrentMonthKey())}
                    pastMonth={getPastMonthKey()}
                    pastMonthStats={getMonthlyRevenue(getPastMonthKey())}
                    color="success"
                    imgPath="dollar.svg"
                    isLoading={isLoading}
                />
            </Grid>

            <Grid size={{xs: 12, sm: 6, md: 3, lg: 3}}>
                <DashboardCard
                    title="Charges"
                    currentMonth={getCurrentMonthKey()}
                    currentMonthStats={getMonthlyExpenses(getCurrentMonthKey())}
                    pastMonth={getPastMonthKey()}
                    pastMonthStats={getMonthlyExpenses(getPastMonthKey())}
                    color="error"
                    imgPath="dollar-red.svg"
                    isLoading={isLoading}
                />
            </Grid>

            <Grid size={{xs: 12, sm: 6, md: 3, lg: 3}}>
                <DashboardCard
                    title="Ventes"
                    currentMonth={getCurrentMonthKey()}
                    currentMonthStats={getMonthlySellOrdersCount(getCurrentMonthKey())}
                    pastMonth={getPastMonthKey()}
                    pastMonthStats={getMonthlySellOrdersCount(getPastMonthKey())}
                    color="primary"
                    imgPath="cart-icon.svg"
                    isLoading={isLoading}
                />
            </Grid>

            <Grid size={{xs: 12, sm: 6, md: 3, lg: 3}}>
                <DashboardCard
                    title="Retour"
                    currentMonth={getCurrentMonthKey()}
                    currentMonthStats={getMonthlyReturnedOrders(getCurrentMonthKey())}
                    pastMonth={getPastMonthKey()}
                    pastMonthStats={getMonthlyReturnedOrders(getPastMonthKey())}
                    color="warning"
                    imgPath="cart-icon.svg"
                    isLoading={isLoading}
                />
            </Grid>
        </>
    );
};

export default DashboardTopCards;