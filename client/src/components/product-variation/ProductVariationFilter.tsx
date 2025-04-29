import React from "react";
import {Autocomplete, Stack, TextField} from "@mui/material";
import TableSearch from "../common/TableSearch";
import {ProductJson} from "../../model/KeynoyModels";

interface FilterProps {
    searchTerm: string;
    product: ProductJson | null;
}

interface ProductVariationFiltersProps {
    filters: FilterProps;
    setFilters: (filters: FilterProps) => void;
    products: ProductJson[];
}

const ProductVariationFilter: React.FC<ProductVariationFiltersProps> = ({ filters, setFilters, products }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TableSearch
                searchTerm={filters.searchTerm}
                setSearchTerm={(newValue) =>
                    setFilters({ ...filters, searchTerm: newValue || "" })
                }
            />
            <Autocomplete
                options={products}
                value={filters.product}
                getOptionKey={(options) => options.id}
                getOptionLabel={(options) => options.name}
                onChange={(e, newValue) =>
                    setFilters({ ...filters, product: newValue || null })
                }
                renderInput={(params) => <TextField {...params} label="Produit" />}
                sx={{ minWidth: 180 }}
                size="small"
            />
        </Stack>
    );
}

export default ProductVariationFilter;