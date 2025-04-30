import React from "react";
import {Autocomplete, Checkbox, FormControlLabel, Stack, TextField} from "@mui/material";
import TableSearch from "../common/TableSearch";
import {ProductJson} from "../../model/KeynoyModels";

interface FilterProps {
    searchTerm: string;
    product: ProductJson | null;
    critical: boolean;
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

            <FormControlLabel
                control={
                    <Checkbox
                        checked={filters.critical}
                        onChange={(e) =>
                            setFilters({ ...filters, critical: e.target.checked })
                        }
                    />
                }
                label="Critique (Quantite ≤ 1.5 × Seuil)"
            />
        </Stack>
    );
}

export default ProductVariationFilter;