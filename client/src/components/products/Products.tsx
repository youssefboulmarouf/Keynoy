import React, {useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../common/TableSearch";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {ModalTypeEnum, ProductJson} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import ProductDialog from "./ProductDialog";
import ProductsList from "./ProductsList";
import {useProductsContext} from "../../context/ProductsContext";
import {useProductTypesContext} from "../../context/ProductTypesContext";
import {useDialogController} from "../common/useDialogController";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Products",
    },
];

const Products: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const {products, loading: loadingProductsData, error: errorProductsData} = useProductsContext();
    const {productTypes, loading: loadingProductTypesData, error: errorProductsTypesData} = useProductTypesContext();

    const productDialog = useDialogController<ProductJson>(
        {id: 0, name: "", productTypeId: 0, productVariations: []}
    );

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productTypes?.find(pt => pt.id === p.productTypeId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <>
            <Breadcrumb title="Products" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <TableCallToActionButton
                                fullwidth={false}
                                callToActionText="Ajouter Produit"
                                callToActionFunction={() => productDialog.openDialog(
                                    ModalTypeEnum.ADD,
                                    {id: 0, name: "", productTypeId: 0, productVariations: []}
                                )}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <ProductsList
                                loadingProductsData={loadingProductsData}
                                loadingProductTypesData={loadingProductTypesData}
                                errorProductsData={errorProductsData}
                                errorProductsTypesData={errorProductsTypesData}
                                data={filteredProducts}
                                productTypesData={productTypes}
                                handleOpenDialogType={productDialog.openDialog}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <ProductDialog
                concernedProduct={productDialog.data}
                productsType={productTypes}
                dialogType={productDialog.type}
                openDialog={productDialog.open}
                closeDialog={productDialog.closeDialog}
            />
        </>
    );
};

export default Products;
