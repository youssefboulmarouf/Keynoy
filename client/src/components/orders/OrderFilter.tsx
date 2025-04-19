import React from "react";
import {Autocomplete, Stack, TextField} from "@mui/material";
import TableSearch from "../common/TableSearch";
import {OrderStatusEnum} from "../../model/KeynoyModels";
import {DatePicker} from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {mapOrderStatusToString, mapStringToOrderStatus, ORDER_STATUS_STRING_OPTIONS} from "./OrderStatusUtils";

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

const OrderFilter: React.FC<OrderFiltersProps> = ({ filters, setFilters }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TableSearch
                searchTerm={filters.searchTerm}
                setSearchTerm={(newValue) =>
                    setFilters({ ...filters, searchTerm: newValue || "" })
                }
            />
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
                {/* TODO : Move date picker to seperated component*/}
                <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(newValue: Date | null) => setFilters({ ...filters, startDate: newValue })}
                    minDate={new Date("01/01/2024")}
                    maxDate={new Date("01/01/2047")}
                />

                <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(newValue: Date | null) => setFilters({ ...filters, endDate: newValue })}
                    minDate={new Date("01/01/2024")}
                    maxDate={new Date("01/01/2047")}
                />
            </LocalizationProvider>
        </Stack>
    );
}

export default OrderFilter;