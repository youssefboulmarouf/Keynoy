import {Chip} from "@mui/material";
import React from "react";
import {OrderStatusEnum} from "../../model/KeynoyModels";

interface OrderStatusChipProps {
    orderStatus: OrderStatusEnum;
}

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({orderStatus}) => {
    const mapOrderStatusToString = (status: OrderStatusEnum) => {
        switch (status) {
            case OrderStatusEnum.CONFIRMED: return "Confirmer";
            case OrderStatusEnum.IN_PROGRESS: return "En Cours";
            case OrderStatusEnum.FINISHED: return "Terminer";
            case OrderStatusEnum.SHIPPED: return "Livrer";
            case OrderStatusEnum.DELIVERED: return "Recu";
            case OrderStatusEnum.RETURNED: return "Retourner";
        }
    }

    const mapOrderStatusToColor = (status: OrderStatusEnum) => {
        switch (status) {
            case OrderStatusEnum.CONFIRMED: return "primary";
            case OrderStatusEnum.IN_PROGRESS: return "secondary";
            case OrderStatusEnum.FINISHED: return "default";
            case OrderStatusEnum.SHIPPED: return "warning";
            case OrderStatusEnum.DELIVERED: return "success";
            case OrderStatusEnum.RETURNED: return "error";
        }
    }

    return (
        <Chip
            color={mapOrderStatusToColor(orderStatus)}
            variant="outlined"
            label={mapOrderStatusToString(orderStatus)}
        />
    );
}

export default OrderStatusChip;