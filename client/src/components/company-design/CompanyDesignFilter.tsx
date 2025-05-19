import {CompanyJson} from "../../model/KeynoyModels";
import {Autocomplete, Stack, TextField} from "@mui/material";
import TableSearch from "../common/TableSearch";
import React from "react";

interface FilterProps {
    searchTerm: string;
    company: CompanyJson | null;
}

interface CompanyDesignFiltersProps {
    filters: FilterProps;
    setFilters: (filters: FilterProps) => void;
    companies: CompanyJson[];
}

const CompanyDesignFilters: React.FC<CompanyDesignFiltersProps> = ({filters, companies, setFilters}) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TableSearch
                searchTerm={filters.searchTerm}
                setSearchTerm={(newValue) =>
                    setFilters({ ...filters, searchTerm: newValue || "" })
                }
            />
            <Autocomplete
                options={companies}
                value={filters.company}
                getOptionKey={(options) => options.id}
                getOptionLabel={(options) => options.name}
                onChange={(e, newValue) =>
                    setFilters({ ...filters, company: newValue || null })
                }
                renderInput={(params) => <TextField {...params} label="Client" />}
                sx={{ minWidth: 180 }}
                size="small"
            />
        </Stack>
    );
}

export default CompanyDesignFilters;