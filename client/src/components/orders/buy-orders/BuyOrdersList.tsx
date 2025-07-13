import {CompanyTypeEnum, ModalTypeEnum, OrderJson, OrderStatusEnum} from "../../../model/KeynoyModels";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from "@mui/material";
import OrderStatusChip from "../order-components/OrderStatusChip";
import {formatDate} from "../../common/Utilities";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EditButton from "../../common/buttons/EditButton";
import DeleteButton from "../../common/buttons/DeleteButton";

interface BuyOrdersListProps {
    buyOrders: OrderJson[];
    handleOpenOrderDialog: (type: ModalTypeEnum, order: OrderJson) => void;
    getCompanyPhoneFromOrder: (order: OrderJson, companyType: string) => string;
    getCompanyNameFromOrder: (order: OrderJson, companyType: string) => string;
}

const BuyOrdersList: React.FC<BuyOrdersListProps> = ({
    buyOrders,
    handleOpenOrderDialog,
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

    if (buyOrders.length === 0) return <Typography>Aucune commande achats trouver</Typography>;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Fournisseur</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Status</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Prix Total</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Date</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Sync Inventaire</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Sync Charge</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(rowsPerPage > 0
                    ? buyOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : buyOrders)
                    .map((order, i) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>
                                {getCompanyNameFromOrder(order, CompanyTypeEnum.SUPPLIERS) + " - " + getCompanyPhoneFromOrder(order, CompanyTypeEnum.SUPPLIERS)}
                            </TableCell>
                            <TableCell>
                                <OrderStatusChip orderStatus={order.orderStatus} />
                            </TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>{formatDate(order.date)}</TableCell>
                            <TableCell>
                                {order.inventoryUpdated ? (
                                    <CheckIcon color="success" width={22} />
                                ) : (
                                    <ClearIcon color="error" width={22} />
                                )}
                            </TableCell>
                            <TableCell>
                                {order.expenseUpdated ? (
                                    <CheckIcon color="success" width={22} />
                                ) : (
                                    <ClearIcon color="error" width={22} />
                                )}
                            </TableCell>
                            <TableCell align="right">
                                <EditButton
                                    tooltipText={"Modifier Commande"}
                                    openDialogWithType={() => handleOpenOrderDialog(ModalTypeEnum.UPDATE, order)}
                                />
                                <DeleteButton
                                    tooltipText={"Supprimer Commande"}
                                    openDialogWithType={() => handleOpenOrderDialog(ModalTypeEnum.DELETE, order)}
                                    disable={order.orderStatus > OrderStatusEnum.CONFIRMED}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
                        colSpan={12}
                        count={buyOrders.length}
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

export default BuyOrdersList;