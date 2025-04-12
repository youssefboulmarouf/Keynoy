import React, {useEffect, useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import {Stack} from "@mui/system";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {
    ModalTypeEnum,
    OrderJson,
    OrderStatusEnum,
    OrderTypeEnum
} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import {useGetOrdersHook} from "../../hooks/OrdersHook";
import {useGetCompaniesHook} from "../../hooks/CompaniesHook";
import {useGetProductsHook} from "../../hooks/ProductsHook";
import {useGetProductTypesHook} from "../../hooks/ProductTypesHook";
import OrderFilter from "./OrderFilter";
import OrdersList from "./OrdersList";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Commandes",
    },
];

interface OrdersProps {
    type: string;
}

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

const Orders: React.FC<OrdersProps> = ({type}) => {
    const [filters, setFilters] = useState<FilterProps>({searchTerm: "", orderStatus: null, startDate: getFirstDayOfCurrentMonth(), endDate: null});

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<ModalTypeEnum>(ModalTypeEnum.ADD);
    const [concernedOrder, setConcernedOrder] = useState<OrderJson>(
        {id: 0, customerId: 0, supplierId: 0, orderType: OrderTypeEnum.BUY, orderStatus: OrderStatusEnum.CONFIRMED, totalPrice: 0, date: new Date(), orderLines: []}
    );

    const [listOrder, setListOrder] = useState<OrderJson[]>([]);

    const { data: ordersData, isLoading: loadingOrdersData, isError: errorOrdersData } = useGetOrdersHook();
    const { data: companiesData, isLoading: loadingCompaniesData, isError: errorCompaniesData } = useGetCompaniesHook();
    const { data: productsData, isLoading: loadingProductsData, isError: errorProductsData } = useGetProductsHook();
    const { data: productTypesData, isLoading: loadingProductTypesData, isError: errorProductsTypesData } = useGetProductTypesHook();

    useEffect(() => {
        if (ordersData) {
            if (type === "Achats") {
                setListOrder(ordersData.filter(order => order.orderType == OrderTypeEnum.BUY));
            } else {
                setListOrder(ordersData.filter(order => order.orderType == OrderTypeEnum.SELL));
            }
        }
    }, [ordersData, type]);

    const handleOpenDialogType = (type: ModalTypeEnum, order: OrderJson) => {
        setConcernedOrder(order)
        setDialogType(type);
        setOpenDialog(true);
    };

    const getCompanyPhoneFromOrder = (order: OrderJson, companyType: string) => {
        if (companyType === "Fournisseurs") {
            return companiesData?.find(c => c.type === "Fournisseurs" && c.id === order.supplierId)?.phone || ""
        } else {
            return companiesData?.find(c => c.type === "Clients" && c.id === order.customerId)?.phone || ""
        }
    }

    const getCompanyNameFromOrder = (order: OrderJson, companyType: string) => {
        if (companyType === "Fournisseurs") {
            return companiesData?.find(c => c.type === "Fournisseurs" && c.id === order.supplierId)?.name || ""
        } else {
            return companiesData?.find(c => c.type === "Clients" && c.id === order.customerId)?.name || ""
        }
    }

    const filteredOrders = listOrder.filter((o) => {
        const companyType = type === "Achats" ? "Fournisseurs" : "Clients";

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
            <Breadcrumb title={type} items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <OrderFilter filters={filters} setFilters={setFilters}/>
                            <TableCallToActionButton
                                callToActionText="Ajouter Commande"
                                callToActionFunction={() => handleOpenDialogType(
                                    ModalTypeEnum.ADD,
                                    {id: 0, customerId: 0, supplierId: 0, orderType: OrderTypeEnum.BUY, orderStatus: OrderStatusEnum.CONFIRMED, totalPrice: 0, date: new Date(), orderLines: []}
                                )}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <OrdersList
                                loadingOrdersData={loadingOrdersData}
                                loadingCompaniesData={loadingCompaniesData}
                                loadingProductsData={loadingProductsData}
                                loadingProductTypesData={loadingProductTypesData}
                                errorOrdersData={errorOrdersData}
                                errorCompaniesData={errorCompaniesData}
                                errorProductsData={errorProductsData}
                                errorProductsTypesData={errorProductsTypesData}
                                type={type}
                                data={filteredOrders}
                                companiesData={companiesData || []}
                                productsData={productsData || []}
                                productTypesData={productTypesData || []}
                                handleOpenDialogType={handleOpenDialogType}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
};

export default Orders;
