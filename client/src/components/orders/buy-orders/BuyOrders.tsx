import React, {useEffect, useState} from "react";
import {
    CompanyJson,
    ModalTypeEnum,
    OrderJson,
    OrderStatusEnum,
    OrderTypeEnum
} from "../../../model/KeynoyModels";
import {useOrdersContext} from "../../../context/OrdersContext";
import {useCompaniesContext} from "../../../context/CompaniesContext";
import {useDialogController} from "../../common/useDialogController";
import Breadcrumb from "../../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import OrderFilter from "../order-components/OrderFilter";
import TableCallToActionButton from "../../common/TableCallToActionButton";
import {Stack} from "@mui/system";
import Box from "@mui/material/Box";
import BuyOrderDialog from "./BuyOrderDialog";
import BuyOrdersList from "./BuyOrdersList";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Commandes",
    },
];

interface FilterProps {
    searchTerm: string;
    orderStatus: OrderStatusEnum | null;
    startDate: Date | null;
    endDate: Date | null;
}

const getFirstDayOfCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

const emptyOrder: OrderJson = {
    id: 0,
    companyId: 0,
    orderType: OrderTypeEnum.BUY,
    orderStatus: OrderStatusEnum.CONFIRMED,
    totalPrice: 0,
    inventoryUpdated: false,
    expenseUpdated: false,
    date: new Date(),
    orderLines: []
}

const BuyOrders: React.FC = () => {
    const [listOrders, setListOrders] = useState<OrderJson[]>([]);
    const [filters, setFilters] = useState<FilterProps>({
        searchTerm: "",
        orderStatus: null,
        startDate: getFirstDayOfCurrentMonth(),
        endDate: null
    });
    const orderDialog = useDialogController<OrderJson>(emptyOrder);
    const { orders, addOrder, editOrder, removeOrder, syncInventory, syncExpense } = useOrdersContext();
    const { companies } = useCompaniesContext();

    useEffect(() => {
        if (orders) {
            setListOrders(
                orders.filter(order => order.orderType == OrderTypeEnum.BUY)
            );
        }
    }, [orders]);

    const getCompanyFromOrder = (order: OrderJson): CompanyJson | null => {
        return companies?.find(c => c.id === order.companyId) ?? null;
    }

    const filteredOrders = listOrders.filter((o) => {
        const company = getCompanyFromOrder(o);

        const matchesSearch = company
            ? company.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
                || company.phone.toLowerCase().includes(filters.searchTerm.toLowerCase())
            : true;

        const matchesStatus = filters.orderStatus ? o.orderStatus === filters.orderStatus : true;

        const orderDate = new Date(o.date);

        const matchesStartDate = filters.startDate ? orderDate >= filters.startDate : true;
        const matchesEndDate = filters.endDate ? orderDate <= filters.endDate : true;

        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    return (
        <>
            <Breadcrumb title={OrderTypeEnum.BUY} items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <OrderFilter filters={filters} setFilters={setFilters}/>
                            <TableCallToActionButton
                                fullwidth={false}
                                callToActionText="Ajouter Commande"
                                callToActionFunction={() => orderDialog.openDialog(ModalTypeEnum.ADD, emptyOrder)}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <BuyOrdersList
                                buyOrders={filteredOrders}
                                handleOpenOrderDialog={orderDialog.openDialog}
                                getCompanyFromOrder={getCompanyFromOrder}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <BuyOrderDialog
                concernedOrder={orderDialog.data}
                dialogType={orderDialog.type}
                openDialog={orderDialog.open}
                closeDialog={orderDialog.closeDialog}
                addOrder={addOrder}
                editOrder={editOrder}
                removeOrder={removeOrder}
                syncInventory={syncInventory}
                syncExpense={syncExpense}
            />
        </>
    );
}

export default BuyOrders;