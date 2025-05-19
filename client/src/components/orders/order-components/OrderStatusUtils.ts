import {OrderStatusEnum} from "../../../model/KeynoyModels";

export const mapOrderStatusToString = (status: OrderStatusEnum | null) => {
    switch (status) {
        case OrderStatusEnum.CONFIRMED: return "Confirmer";
        case OrderStatusEnum.IN_PROGRESS: return "En Cours";
        case OrderStatusEnum.FINISHED: return "Terminer";
        case OrderStatusEnum.SHIPPED: return "Livrer";
        case OrderStatusEnum.DELIVERED: return "Recu";
        case OrderStatusEnum.RETURNED: return "Retourner";
        default: return null;
    }
}

export const mapStringToOrderStatus = (status: string | null) => {
    switch (status) {
        case "Confirmer": return OrderStatusEnum.CONFIRMED;
        case "En Cours": return OrderStatusEnum.IN_PROGRESS;
        case "Terminer": return OrderStatusEnum.FINISHED;
        case "Livrer": return OrderStatusEnum.SHIPPED;
        case "Recu": return OrderStatusEnum.DELIVERED;
        case "Retourner": return OrderStatusEnum.RETURNED;
        default: return null;
    }
}

export const mapOrderStatusToColor = (status: OrderStatusEnum) => {
    switch (status) {
        case OrderStatusEnum.CONFIRMED: return "primary";
        case OrderStatusEnum.IN_PROGRESS: return "secondary";
        case OrderStatusEnum.FINISHED: return "default";
        case OrderStatusEnum.SHIPPED: return "warning";
        case OrderStatusEnum.DELIVERED: return "success";
        case OrderStatusEnum.RETURNED: return "error";
    }
}

export const ORDER_STATUS_STRING_OPTIONS = [
    "Confirmer",
    "En Cours",
    "Terminer",
    "Livrer",
    "Recu",
    "Retourner"
];