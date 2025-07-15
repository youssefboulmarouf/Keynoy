import {
    CompanyJson,
    ModalTypeEnum,
    OrderJson,
    OrderStatusEnum,
} from "../../../model/KeynoyModels";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from "@mui/material";
import OrderStatusChip from "../order-components/OrderStatusChip";
import {formatDate} from "../../common/Utilities";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {useShippingContext} from "../../../context/ShippingContext";
import ShippingButton from "../../common/buttons/ShippingButton";
import EditButton from "../../common/buttons/EditButton";
import DeleteButton from "../../common/buttons/DeleteButton";
import SyncInventoryButton from "../../common/buttons/SyncInventoryButton";
import SyncExpenseButton from "../../common/buttons/SyncExpenseButton";
import SyncIcon from "@mui/icons-material/Sync";

interface SellOrdersListProps {
    sellOrders: OrderJson[];
    handleOpenOrderDialog: (type: ModalTypeEnum, order: OrderJson) => void;
    handleOpenShippingDialog: (type: ModalTypeEnum, order: OrderJson) => void;
    getCompanyFromOrder: (order: OrderJson) => CompanyJson | null;
}

const SellOrderList: React.FC<SellOrdersListProps> = ({
    sellOrders,
    handleOpenOrderDialog,
    handleOpenShippingDialog,
    getCompanyFromOrder
}) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const { shippings } = useShippingContext();

    const loadShippingDetails = (order: OrderJson) => shippings.find(s => s.orderId === order.id) ?? null;

    const handleChangePage = (_: any, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const renderStatusIcon = (status: boolean) =>
        status
            ? <CheckIcon color="success" width={22} />
            : <ClearIcon color="error" width={22} />;

    const paginatedOrders =
        rowsPerPage > 0
            ? sellOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : sellOrders;

    if (sellOrders.length === 0) return <Typography>Aucune commande vente trouver</Typography>;
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Client</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Status</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Prix Total</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Date</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Sync Inventaire</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Sync Charge</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Date Livraison</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Date Reception</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Prix Livraison</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginatedOrders.map(order => {
                    const shipping = loadShippingDetails(order);
                    const company = getCompanyFromOrder(order);

                    return (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{company ? `${company.name} - ${company.phone}` : '-'}</TableCell>
                            <TableCell><OrderStatusChip orderStatus={order.orderStatus} /></TableCell>
                            <TableCell>{order.totalPrice}</TableCell>
                            <TableCell>{formatDate(order.date)}</TableCell>
                            <TableCell>{renderStatusIcon(order.inventoryUpdated)}</TableCell>
                            <TableCell>{renderStatusIcon(order.expenseUpdated)}</TableCell>
                            <TableCell>{shipping ? formatDate(shipping.shippingDate) : "-"}</TableCell>
                            <TableCell>{shipping?.deliveryDate ? formatDate(shipping.deliveryDate) : "-"}</TableCell>
                            <TableCell>{shipping ? shipping.price : "-"}</TableCell>
                            <TableCell align="right">
                                {order.orderStatus >= OrderStatusEnum.IN_PROGRESS && (
                                    <SyncInventoryButton
                                        tooltipText="Sync Inventaire"
                                        openDialogWithType={() => {}}
                                    />
                                )}
                                {shipping && (
                                    <SyncExpenseButton
                                        tooltipText="Sync Charge"
                                        openDialogWithType={() => {}}
                                    />
                                )}
                                {order.orderStatus >= OrderStatusEnum.FINISHED && (
                                    <ShippingButton
                                        tooltipText="Livraison"
                                        openDialogWithType={() => handleOpenShippingDialog(ModalTypeEnum.ADD, order)}
                                    />
                                )}
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
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
                        colSpan={12}
                        count={sellOrders.length}
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

export default SellOrderList;