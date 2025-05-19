import {Chip} from "@mui/material";
import React from "react";
import {OrderStatusEnum} from "../../../model/KeynoyModels";
import {mapOrderStatusToColor, mapOrderStatusToString} from "./OrderStatusUtils";

interface OrderStatusChipProps {
    orderStatus: OrderStatusEnum;
}

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({orderStatus}) => {
   return (
        <Chip
            color={mapOrderStatusToColor(orderStatus)}
            variant="outlined"
            label={mapOrderStatusToString(orderStatus)}
        />
    );
}

export default OrderStatusChip;