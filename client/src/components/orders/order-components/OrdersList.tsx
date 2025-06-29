import React, {useState} from "react";
import {ModalTypeEnum, OrderJson, OrderTypeEnum, ShippingJson} from "../../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from "@mui/material";
import OrderRow from "./OrderRow";

interface OrdersListProps {
    type: OrderTypeEnum;
    data: OrderJson[];
    handleOpenOrderDialog: (type: ModalTypeEnum, order: OrderJson) => void;
    handleOpenShippingDialog?: (type: ModalTypeEnum, order: OrderJson) => void;
    getCompanyPhoneFromOrder: (order: OrderJson, companyType: string) => string;
    getCompanyNameFromOrder: (order: OrderJson, companyType: string) => string;
}

const OrdersList: React.FC<OrdersListProps> = ({
    type,
    data,
    handleOpenOrderDialog,
    handleOpenShippingDialog,
    getCompanyPhoneFromOrder,
    getCompanyNameFromOrder
}) => {
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
    if (data.length === 0) {
        listOrders = <Typography>No order found</Typography>;
    } else {
        listOrders = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        {type === OrderTypeEnum.BUY ? (
                            <TableCell><Typography variant="h6" fontSize="14px">Fournisseur</Typography></TableCell>
                        ) : (
                            <TableCell><Typography variant="h6" fontSize="14px">Client</Typography></TableCell>
                        )}
                        <TableCell><Typography variant="h6" fontSize="14px">Status</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Prix Total</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Date</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Inventaire Sync</Typography></TableCell>
                        {type === OrderTypeEnum.BUY ? (
                            <TableCell><Typography variant="h6" fontSize="14px">Charge Sync</Typography></TableCell>
                        ) : (
                            <>
                                <TableCell><Typography variant="h6" fontSize="14px">Charge Livraison Sync</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Date Livraison</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Date Reception</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Prix Livraison</Typography></TableCell>
                            </>
                        )}
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
                                type={type}
                                getCompanyNameFromOrder={getCompanyNameFromOrder}
                                getCompanyPhoneFromOrder={getCompanyPhoneFromOrder}
                                handleOpenOrderDialog={handleOpenOrderDialog}
                                handleOpenShippingDialog={handleOpenShippingDialog}
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