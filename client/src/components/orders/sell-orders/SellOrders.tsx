import React, {useEffect, useState} from "react";
import Breadcrumb from "../../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import {Stack} from "@mui/system";
import TableCallToActionButton from "../../common/TableCallToActionButton";
import {
    CompanyTypeEnum,
    ModalTypeEnum,
    OrderJson,
    OrderStatusEnum,
    OrderTypeEnum,
} from "../../../model/KeynoyModels";
import Box from "@mui/material/Box";
import OrderFilter from "../order-components/OrderFilter";
import OrdersList from "../order-components/OrdersList";
import SellOrderDialog from "./SellOrderDialog";
import {useCompaniesContext} from "../../../context/CompaniesContext";
import {useDialogController} from "../../common/useDialogController";
import {useOrdersContext} from "../../../context/OrdersContext";
import {getFirstDayOfCurrentMonth} from "../../common/Utilities";
import ShipOrderDialog from "./ShipOrderDialog";

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

const SellOrders: React.FC = () => {
    const [listOrders, setListOrders] = useState<OrderJson[]>([]);
    const [filters, setFilters] = useState<FilterProps>({
        searchTerm: "",
        orderStatus: null,
        startDate: getFirstDayOfCurrentMonth(),
        endDate: null
    });
    const orderDialog = useDialogController<OrderJson>(emptyOrder);
    const shippingDialog = useDialogController<OrderJson>(emptyOrder);

    const { orders, addOrder, editOrder, removeOrder, syncInventory } = useOrdersContext();
    const { companies } = useCompaniesContext();

    useEffect(() => {
        if (orders) {
            setListOrders(
                orders.filter(order => order.orderType == OrderTypeEnum.SELL)
            );
        }
    }, [orders]);

    const getCompanyPhoneFromOrder = (order: OrderJson, companyType: string) => {
        return companies?.find(c => c.companyType === companyType && c.id === order.companyId)?.phone ?? "";
    }

    const getCompanyNameFromOrder = (order: OrderJson, companyType: string) => {
        return companies?.find(c => c.companyType === companyType && c.id === order.companyId)?.name ?? "";
    }

    const filteredOrders = listOrders.filter((o) => {
        const companyType = CompanyTypeEnum.CUSTOMERS;

        const matchesSearch =
            getCompanyPhoneFromOrder(o, companyType).toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            getCompanyNameFromOrder(o, companyType).toLowerCase().includes(filters.searchTerm.toLowerCase());

        const matchesStatus = filters.orderStatus ? o.orderStatus === filters.orderStatus : true;

        const orderDate = new Date(o.date);

        const matchesStartDate = filters.startDate ? orderDate >= filters.startDate : true;
        const matchesEndDate = filters.endDate ? orderDate <= filters.endDate : true;

        return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    return (
        <>
            <Breadcrumb title={OrderTypeEnum.SELL} items={bCrumb} />
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
                            <OrdersList
                                type={OrderTypeEnum.SELL}
                                data={filteredOrders}
                                handleOpenOrderDialog={orderDialog.openDialog}
                                handleOpenShippingDialog={shippingDialog.openDialog}
                                getCompanyPhoneFromOrder={getCompanyPhoneFromOrder}
                                getCompanyNameFromOrder={getCompanyNameFromOrder}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <SellOrderDialog
                concernedOrder={orderDialog.data}
                dialogType={orderDialog.type}
                openDialog={orderDialog.open}
                closeDialog={orderDialog.closeDialog}
                addOrder={addOrder}
                editOrder={editOrder}
                removeOrder={removeOrder}
                syncInventory={syncInventory}
            />
            <ShipOrderDialog
                concernedOrder={shippingDialog.data}
                customers={companies.filter(c => c.companyType === CompanyTypeEnum.CUSTOMERS)}
                shippers={companies.filter(c => c.companyType === CompanyTypeEnum.SHIPPERS)}
                dialogType={shippingDialog.type}
                openDialog={shippingDialog.open}
                closeDialog={shippingDialog.closeDialog}
            />
        </>
    );
};

export default SellOrders;
