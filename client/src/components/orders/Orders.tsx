import React, {useEffect, useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead, TablePagination,
    TableRow
} from "@mui/material";
import {Stack} from "@mui/system";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {
    ModalTypeEnum,
    OrderJson,
    OrderStatusEnum,
    OrderTypeEnum
} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {useGetOrdersHook} from "../../hooks/OrdersHook";
import {useGetCompaniesHook} from "../../hooks/CompaniesHook";
import {useGetProductsHook} from "../../hooks/ProductsHook";
import {useGetProductTypesHook} from "../../hooks/ProductTypesHook";
import OrderRow from "./OrderRow";
import OrderFilter from "./OrderFilter";

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

    const [openRow, setOpenRow] = useState(false);
    const [rowToOpen, setRowToOpen] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

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

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    let listOrders;
    if (loadingOrdersData || loadingCompaniesData || loadingProductsData || loadingProductTypesData) {
        listOrders = <LoadingComponent message="Loading Orders" />;
    } else if (errorOrdersData || errorCompaniesData || errorProductsData ||errorProductsTypesData) {
        listOrders = <Typography color="error">Error loading orders</Typography>;
    } else if (filteredOrders.length === 0) {
        listOrders = <Typography>No order found</Typography>;
    } else {
        listOrders = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        {type === "Achats" ? (
                            <TableCell><Typography variant="h6" fontSize="14px">Fournisseur</Typography></TableCell>
                        ) : (
                            <TableCell><Typography variant="h6" fontSize="14px">Client</Typography></TableCell>
                        )}
                        <TableCell><Typography variant="h6" fontSize="14px">Status</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Prix Total</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Date</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : filteredOrders)
                        .map((order, i) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                                rowIndex={i + page * rowsPerPage}
                                type={type}
                                openRow={openRow}
                                rowToOpen={rowToOpen}
                                handleExpandRow={(index) => {
                                    setOpenRow(!openRow);
                                    setRowToOpen(index);
                                }}
                                getCompanyNameFromOrder={getCompanyNameFromOrder}
                                getCompanyPhoneFromOrder={getCompanyPhoneFromOrder}
                                productsData={productsData || []}
                                productTypesData={productTypesData || []}
                                handleOpenDialogType={handleOpenDialogType}
                            />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
                            colSpan={12}
                            count={filteredOrders.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        );
    }
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
                            {listOrders}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
};

export default Orders;
