import React, {useMemo, useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import {Stack} from "@mui/system";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import ProductDialog from "./ProductDialog";
import ProductsList from "./ProductsList";
import {useProductsContext} from "../../context/ProductsContext";
import {useProductTypesContext} from "../../context/ProductTypesContext";
import {useDialogController} from "../common/useDialogController";
import ProductFilter from "./ProductFilter";

interface FilterProps {
    searchTerm: string;
    sellable: boolean;
    productType: ProductTypeJson | null;
}

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Products",
    },
];

const emptyProduct: ProductJson = {
    id: 0,
    name: "",
    isSellable: false,
    isLayer: false,
    isPaint: false,
    isPrintable: false,
    isPaintTool: false,
    isPrintTool: false,
    productTypeId: 0
}

const Products: React.FC = () => {
    const [filters, setFilters] = useState<FilterProps>({searchTerm: "", sellable: false, productType: null});
    const {products, addProduct, editProduct, removeProduct, loading: isLoadingProducts} = useProductsContext();
    const {productTypes, loading: isLoadingProductTypes} = useProductTypesContext();
    const productDialog = useDialogController<ProductJson>(emptyProduct);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const searchTerm = filters.searchTerm.toLowerCase();
            const productName = p.name.toLowerCase();
            const productTypeName = productTypes.find(pt => pt.id === p.productTypeId)?.name.toLowerCase() ?? "";

            const productNameMatchSearch = filters.searchTerm ? productName.includes(searchTerm) : true;
            const productTypeNameMatchSearch = filters.searchTerm ? productTypeName.includes(searchTerm) : true;
            const productIsPartOfType = filters.productType ? p.productTypeId === filters.productType.id : true;
            const sellableProducts = filters.sellable ? p.isSellable : true;

            return (productNameMatchSearch || productTypeNameMatchSearch) && sellableProducts && productIsPartOfType;
        }) || [];
    }, [products, filters, productTypes]);

    return (
        <>
            <Breadcrumb title="Products" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <ProductFilter filters={filters} setFilters={setFilters} productTypes={productTypes}/>
                            <TableCallToActionButton
                                fullwidth={false}
                                callToActionText="Ajouter Produit"
                                callToActionFunction={() => productDialog.openDialog(ModalTypeEnum.ADD, emptyProduct)}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <ProductsList
                                products={filteredProducts}
                                productTypes={productTypes}
                                openDialogWithType={productDialog.openDialog}
                                isLoading={isLoadingProducts || isLoadingProductTypes}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <ProductDialog
                selectedProduct={productDialog.data}
                productsType={productTypes}
                dialogType={productDialog.type}
                openDialog={productDialog.open}
                closeDialog={productDialog.closeDialog}
                addProduct={addProduct}
                editProduct={editProduct}
                removeProduct={removeProduct}
            />
        </>
    );
};

export default Products;
