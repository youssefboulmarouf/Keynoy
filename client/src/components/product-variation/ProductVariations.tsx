import {ModalTypeEnum, ProductJson, ProductVariationJson} from "../../model/KeynoyModels";
import React, {useMemo, useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid, Stack} from "@mui/material";
import TableCallToActionButton from "../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import ProductVariationFilter from "./ProductVariationFilter";
import {useProductsContext} from "../../context/ProductsContext";
import {useDialogController} from "../common/useDialogController";
import {useColorContext} from "../../context/ColorsContext";
import {useProductVariationContext} from "../../context/ProductVariationContext";
import ProductVariationList from "./ProductVariationList";
import ProductVariantDialog from "./ProductVariationDialog";

interface FilterProps {
    searchTerm: string;
    product: ProductJson | null;
}

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Variations",
    },
];

const ProductVariations: React.FC = () => {
    const [filters, setFilters] = useState<FilterProps>({searchTerm: "", product: null});
    const variationDialog = useDialogController<ProductVariationJson>({
        id: 0,
        name: "",
        productId: 0,
        colorId: 0,
        quantity: 0,
        size: "",
        threshold: 0
    });
    const {variations, addVariant, editVariant, removeVariant} = useProductVariationContext()
    const {products} = useProductsContext();
    const {colors} = useColorContext();

    const filteredVariations = useMemo(() => {
        return variations.filter(variation => {
            const searchTerm = filters.searchTerm.toLowerCase();
            const variationName = variation.name.toLowerCase();
            const variationSize = variation.size.toLowerCase();
            const ProductName = products.find(p => p.id === variation.productId)?.name.toLowerCase() ?? "";

            const variationNameMatchSearch = searchTerm ? variationName.includes(searchTerm.toLowerCase()) : true;
            const variationSizeMatchSearch = searchTerm ? variationSize.includes(searchTerm.toLowerCase()) : true;
            const ProductNameMatchSearch = searchTerm ? ProductName.includes(searchTerm.toLowerCase()) : true;
            const variationIsPartOfProduct = filters.product ? variation.productId === filters.product.id : true;

            return (variationNameMatchSearch || variationSizeMatchSearch || ProductNameMatchSearch) && variationIsPartOfProduct;
        }) || [];
    }, [filters, variations, products])

    return (
        <>
            <Breadcrumb title="Variations" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <ProductVariationFilter filters={filters} setFilters={setFilters} products={products}/>
                            <TableCallToActionButton
                                fullwidth={false}
                                callToActionText="Ajouter Variation"
                                callToActionFunction={() => variationDialog.openDialog(
                                    ModalTypeEnum.ADD,
                                    {
                                        id: 0,
                                        name: "",
                                        productId: 0,
                                        colorId: 0,
                                        quantity: 0,
                                        size: "",
                                        threshold: 0
                                    }
                                )}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <ProductVariationList
                                productVariations={filteredVariations}
                                products={products}
                                colors={colors}
                                openDialogWithType={variationDialog.openDialog}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <ProductVariantDialog
                products={products}
                colors={colors}
                selectedVariant={variationDialog.data}
                openVariationDialog={variationDialog.open}
                closeDialog={variationDialog.closeDialog}
                dialogType={variationDialog.type}
                addVariant={addVariant}
                editVariant={editVariant}
                removeVariant={removeVariant}
            />
        </>
    );
}

export default ProductVariations;