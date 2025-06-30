import React from "react";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TableSearch from "../common/TableSearch";

interface FilterProps {
    searchTerm: string;
    order: boolean;
    shipping: boolean;
    startDate: Date | null;
    endDate: Date | null;
}

interface ExpenseFiltersProps {
    filters: FilterProps;
    setFilters: (filters: FilterProps) => void;
}

const ExpenseFilter: React.FC<ExpenseFiltersProps> = ({ filters, setFilters }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TableSearch
                searchTerm={filters.searchTerm}
                setSearchTerm={(newValue) =>
                    setFilters({ ...filters, searchTerm: newValue || "" })
                }
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

            <FormControlLabel
                control={
                    <Checkbox
                        checked={filters.order}
                        onChange={(e) =>
                            setFilters({ ...filters, order: e.target.checked })
                        }
                    />
                }
                label="Achats"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={filters.shipping}
                        onChange={(e) =>
                            setFilters({ ...filters, shipping: e.target.checked })
                        }
                    />
                }
                label="Livraison"
            />
        </Stack>
    );
}

export default ExpenseFilter;