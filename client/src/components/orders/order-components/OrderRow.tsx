import {TableCell, TableRow} from "@mui/material";
import OrderStatusChip from "./OrderStatusChip";
import React from "react";
import {CompanyTypeEnum, ModalTypeEnum, OrderJson, OrderStatusEnum, OrderTypeEnum} from "../../../model/KeynoyModels";
import DeleteButton from "../../common/buttons/DeleteButton";
import EditButton from "../../common/buttons/EditButton";
import {formatDate} from "../../common/Utilities";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

interface OrderRowProps {
    order: OrderJson;
    type: string;
    getCompanyNameFromOrder: (order: OrderJson, companyType: string) => string;
    getCompanyPhoneFromOrder: (order: OrderJson, companyType: string) => string;
    handleOpenDialogType: (type: ModalTypeEnum, order: OrderJson) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({
    order,
    type,
    getCompanyNameFromOrder,
    getCompanyPhoneFromOrder,
    handleOpenDialogType
}) => {

    return (
        <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            {type === OrderTypeEnum.BUY ? (
                <TableCell>
                    {getCompanyNameFromOrder(order, CompanyTypeEnum.SUPPLIERS) + " - " + getCompanyPhoneFromOrder(order, CompanyTypeEnum.SUPPLIERS)}
                </TableCell>
            ) : (
                <TableCell>
                    {getCompanyNameFromOrder(order, CompanyTypeEnum.CUSTOMERS) + " - " + getCompanyPhoneFromOrder(order, CompanyTypeEnum.CUSTOMERS)}
                </TableCell>
            )}
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
            <TableCell align="right">
                <EditButton
                    tooltipText={"Modifier Commande"}
                    openDialogWithType={() => handleOpenDialogType(ModalTypeEnum.UPDATE, order)}
                />
                <DeleteButton
                    tooltipText={"Supprimer Commande"}
                    openDialogWithType={() => handleOpenDialogType(ModalTypeEnum.DELETE, order)}
                    disable={order.orderStatus > OrderStatusEnum.CONFIRMED}
                />
            </TableCell>
        </TableRow>
    )
}

export default OrderRow;