import React from "react";
import {Autocomplete, Checkbox, FormControlLabel, Stack, TextField} from "@mui/material";
import TableSearch from "../common/TableSearch";
import {ProductTypeJson} from "../../model/KeynoyModels";

interface FilterProps {
    searchTerm: string;
    sellable: boolean;
    productType: ProductTypeJson | null;
}

interface ProductFiltersProps {
    filters: FilterProps;
    setFilters: (filters: FilterProps) => void;
    productTypes: ProductTypeJson[];
}

const ProductFilter: React.FC<ProductFiltersProps> = ({ filters, setFilters, productTypes }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TableSearch
                searchTerm={filters.searchTerm}
                setSearchTerm={(newValue) =>
                    setFilters({ ...filters, searchTerm: newValue || "" })
                }
            />
            <Autocomplete
                options={productTypes}
                value={filters.productType}
                getOptionKey={(options) => options.id}
                getOptionLabel={(options) => options.name}
                onChange={(e, newValue) =>
                    setFilters({ ...filters, productType: newValue || null })
                }
                renderInput={(params) => <TextField {...params} label="Type Produit" />}
                sx={{ minWidth: 180 }}
                size="small"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={filters.sellable}
                        onChange={(e) => {
                            setFilters({...filters, sellable: e.target.checked })
                        }}
                    />
                }
                label="Vendable"
            />
        </Stack>
    );
}

export default ProductFilter;