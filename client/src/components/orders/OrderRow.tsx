import {TableCell, TableRow} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OrderStatusChip from "./OrderStatusChip";
import OrderLinesTable from "./OrderLinesTable";
import React from "react";
import {ModalTypeEnum, OrderJson} from "../../model/KeynoyModels";
import DeleteButton from "../common/DeleteButton";
import EditButton from "../common/EditButton";

interface OrderRowProps {
    order: OrderJson;
    rowIndex: number;
    type: string;
    openRow: boolean;
    rowToOpen: number;
    handleExpandRow: (index: number) => void;
    getCompanyNameFromOrder: (order: OrderJson, companyType: string) => string;
    getCompanyPhoneFromOrder: (order: OrderJson, companyType: string) => string;
    productsData: any[];
    productTypesData: any[];
    handleOpenDialogType: (type: ModalTypeEnum, order: OrderJson) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({
    order,
    rowIndex,
    type,
    openRow,
    rowToOpen,
    handleExpandRow,
    getCompanyNameFromOrder,
    getCompanyPhoneFromOrder,
    productsData,
    productTypesData,
    handleOpenDialogType
}) => {
    const formatDate = (date: Date) => {
        const newDate = new Date(date);
        const day = newDate.getUTCDate().toString().padStart(2, "0");
        const month = (newDate.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = newDate.getUTCFullYear();

        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <TableRow key={order.id}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleExpandRow(rowIndex)}
                    >
                        {openRow && rowToOpen === rowIndex ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell>{order.id}</TableCell>
                {type === "Achats" ? (
                    <TableCell>
                        {getCompanyNameFromOrder(order, "Fournisseurs") + " - " + getCompanyPhoneFromOrder(order, "Fournisseurs")}
                    </TableCell>
                ) : (
                    <TableCell>
                        {getCompanyNameFromOrder(order, "Clients") + " - " + getCompanyPhoneFromOrder(order, "Clients")}
                    </TableCell>
                )}
                <TableCell>
                    <OrderStatusChip orderStatus={order.orderStatus} />
                </TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell align="right">
                    <EditButton tooltipText={"Modifier Commande"} entity={order} handleOpenDialogType={handleOpenDialogType} />
                    <DeleteButton tooltipText={"Supprimer Commande"} entity={order} handleOpenDialogType={handleOpenDialogType} />
                </TableCell>
            </TableRow>
            <TableRow key={order.id+"line"}>
                <TableCell sx={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "primary.light"}} colSpan={12}>
                    <OrderLinesTable
                        openRow={openRow}
                        rowToOpen={rowToOpen}
                        rowIndex={rowIndex}
                        orderLines={order.orderLines}
                        products={productsData || []}
                        productTypes={productTypesData || []}
                    />
                </TableCell>
            </TableRow>
        </>
    )
}

export default OrderRow;