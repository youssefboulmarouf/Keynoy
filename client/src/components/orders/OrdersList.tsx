import React, {useState} from "react";
import {ModalTypeEnum, OrderJson, OrderTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from "@mui/material";
import OrderRow from "./OrderRow";

interface OrdersListProps {
    loadingOrdersData: boolean;
    loadingCompaniesData: boolean;
    loadingProductsData: boolean;
    loadingProductTypesData: boolean;
    errorOrdersData: boolean;
    errorCompaniesData: boolean;
    errorProductsData: boolean;
    errorProductsTypesData: boolean;
    type: string;
    data: OrderJson[];
    productsData: ProductJson[];
    productTypesData: ProductTypeJson[];
    handleOpenDialogType: (type: ModalTypeEnum, order: OrderJson) => void;
    getCompanyPhoneFromOrder: (order: OrderJson, companyType: string) => string;
    getCompanyNameFromOrder: (order: OrderJson, companyType: string) => string;
}

const OrdersList: React.FC<OrdersListProps> = ({
    loadingOrdersData,
    loadingCompaniesData,
    loadingProductsData,
    loadingProductTypesData,
    errorOrdersData,
    errorCompaniesData,
    errorProductsData,
    errorProductsTypesData,
    type,
    data,
    productsData,
    productTypesData,
    handleOpenDialogType,
    getCompanyPhoneFromOrder,
    getCompanyNameFromOrder
}) => {
    const [openRow, setOpenRow] = useState(false);
    const [rowToOpen, setRowToOpen] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    let listOrders;
    if (loadingOrdersData || loadingCompaniesData || loadingProductsData || loadingProductTypesData) {
        listOrders = <LoadingComponent message="Loading Orders" />;
    } else if (errorOrdersData || errorCompaniesData || errorProductsData ||errorProductsTypesData) {
        listOrders = <Typography color="error">Error loading orders</Typography>;
    } else if (data.length === 0) {
        listOrders = <Typography>No order found</Typography>;
    } else {
        listOrders = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        {type === OrderTypeEnum.BUY ? (
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
                        ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : data)
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
                                productsData={productsData}
                                productTypesData={productTypesData}
                                handleOpenDialogType={handleOpenDialogType}
                            />
                        ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
                            colSpan={12}
                            count={data.length}
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

    return (<>{listOrders}</>)
}

export default OrdersList;