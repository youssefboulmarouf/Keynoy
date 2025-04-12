import React from "react";
import {Autocomplete, Stack, TextField} from "@mui/material";
import TableSearch from "../common/TableSearch";
import {OrderStatusEnum} from "../../model/KeynoyModels";
import {DatePicker} from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FilterProps {
    searchTerm: string;
    orderStatus: OrderStatusEnum | null;
    startDate: Date | null;
    endDate: Date | null;
}

interface OrderFiltersProps {
    filters: FilterProps;
    setFilters: (filters: FilterProps) => void;
}

const ORDER_STATUS_STRING_OPTIONS = [
    "Confirmer",
    "En Cours",
    "Terminer",
    "Livrer",
    "Recu",
    "Retourner"
];

const mapStringToOrderStatus = (status: string | null) => {
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

const mapOrderStatusToString = (status: OrderStatusEnum | null) => {
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

const OrderFilter: React.FC<OrderFiltersProps> = ({ filters, setFilters }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TableSearch searchTerm={filters.searchTerm} setSearchTerm={(newValue) =>
                setFilters({ ...filters, searchTerm: newValue || "" })
            } />
            <Autocomplete
                options={ORDER_STATUS_STRING_OPTIONS}
                value={mapOrderStatusToString(filters.orderStatus)}
                onChange={(e, newValue) =>
                    setFilters({ ...filters, orderStatus: mapStringToOrderStatus(newValue) || null })
                }
                renderInput={(params) => <TextField {...params} label="Status" />}
                sx={{ minWidth: 180 }}
                size="small"
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(newValue: Date | null) => setFilters({ ...filters, startDate: newValue })}
                />

                <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(newValue: Date | null) => setFilters({ ...filters, endDate: newValue })}
                />
            </LocalizationProvider>
        </Stack>
    );
}

export default OrderFilter;