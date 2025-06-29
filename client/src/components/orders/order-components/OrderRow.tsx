import {TableCell, TableRow} from "@mui/material";
import OrderStatusChip from "./OrderStatusChip";
import React, {useEffect, useState} from "react";
import {
    CompanyTypeEnum,
    ModalTypeEnum,
    OrderJson,
    OrderStatusEnum,
    OrderTypeEnum,
    ShippingJson
} from "../../../model/KeynoyModels";
import DeleteButton from "../../common/buttons/DeleteButton";
import EditButton from "../../common/buttons/EditButton";
import {formatDate} from "../../common/Utilities";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ShippingButton from "../../common/buttons/ShippingButton";
import {useShippingContext} from "../../../context/ShippingContext";

interface OrderRowProps {
    order: OrderJson;
    type: OrderTypeEnum;
    getCompanyNameFromOrder: (order: OrderJson, companyType: string) => string;
    getCompanyPhoneFromOrder: (order: OrderJson, companyType: string) => string;
    handleOpenOrderDialog: (type: ModalTypeEnum, order: OrderJson) => void;
    handleOpenShippingDialog?: (type: ModalTypeEnum, order: OrderJson) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({
    order,
    type,
    getCompanyNameFromOrder,
    getCompanyPhoneFromOrder,
    handleOpenOrderDialog,
    handleOpenShippingDialog
}) => {
    const [shippingDetails, setShippingDetails] = useState<ShippingJson | null>(null)
    const { shippings } = useShippingContext();

    useEffect(() => {
        setShippingDetails(shippings.find(s => s.orderId === order.id) ?? null)
    }, [shippings])

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
            <TableCell>
                {order.expenseUpdated ? (
                    <CheckIcon color="success" width={22} />
                ) : (
                    <ClearIcon color="error" width={22} />
                )}
            </TableCell>
            {type === OrderTypeEnum.SELL ? (
                <>
                    <TableCell>
                        {(shippingDetails) ? formatDate(shippingDetails.shippingDate) : "-"}
                    </TableCell>
                    <TableCell>
                        {(shippingDetails && shippingDetails.deliveryDate) ? formatDate(shippingDetails.deliveryDate) : "-"}
                    </TableCell>
                    <TableCell>
                        {(shippingDetails) ? shippingDetails.price : "-"}
                    </TableCell>
                </>
            ) : ('')}
            <TableCell align="right">
                {(handleOpenShippingDialog && order.orderStatus >= OrderStatusEnum.FINISHED && order.orderType === OrderTypeEnum.SELL)
                    ? (
                        <ShippingButton
                            tooltipText={"Livraison"}
                            openDialogWithType={() => handleOpenShippingDialog(ModalTypeEnum.ADD, order)}
                        />
                    ) : ('')
                }

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
    )
}

export default OrderRow;