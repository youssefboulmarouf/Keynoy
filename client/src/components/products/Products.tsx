import React, {useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../common/TableSearch";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {ColorEnum, ModalTypeEnum, ProductJson} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import {useGetProductsHook} from "../../hooks/ProductsHook";
import {useGetProductTypesHook} from "../../hooks/ProductTypesHook";
import ProductDialog from "./ProductDialog";
import ProductsList from "./ProductsList";

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
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<ModalTypeEnum>(ModalTypeEnum.ADD);
    const [concernedProduct, setConcernedProduct] = useState<ProductJson>(
        {id: 0, name: "", size: "", productTypeId: 0, color: ColorEnum.BLACK, threshold: 0, totalQuantity: 0}
    );
    const { data: productsData, isLoading: loadingProductsData, isError: errorProductsData } = useGetProductsHook();
    const { data: productTypesData, isLoading: loadingProductTypesData, isError: errorProductsTypesData } = useGetProductTypesHook();

    const handleOpenDialogType = (type: ModalTypeEnum, product: ProductJson) => {
        setConcernedProduct(product);
        setDialogType(type);
        setOpenDialog(true);
    };

    const filteredProducts = productsData?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productTypesData?.find(pt => pt.id === p.productTypeId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                callToActionText="Ajouter Produit"
                                callToActionFunction={() => handleOpenDialogType(
                                    ModalTypeEnum.ADD,
                                    {id: 0, name: "", size: "", productTypeId: 0, color: ColorEnum.BLACK, threshold: 0, totalQuantity: 0}
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
                                productTypesData={productTypesData}
                                handleOpenDialogType={handleOpenDialogType}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <ProductDialog
                concernedProduct={concernedProduct}
                productsType={productTypesData || []}
                dialogType={dialogType}
                openDialog={openDialog}
                closeDialog={() => setOpenDialog(false)}
            />
        </>
    );
};

export default Products;
