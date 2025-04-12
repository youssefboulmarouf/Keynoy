import React, {useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../common/TableSearch";
import TableCallToActionButton from "../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import {useGetProductTypesHook} from "../../hooks/ProductTypesHook";
import ProductTypeDialog from "./ProductTypeDialog";
import {ModalTypeEnum, ProductTypeJson} from "../../model/KeynoyModels";
import ProductTypesList from "./ProductTypesList";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Product Types",
    },
];

const ProductTypes: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<ModalTypeEnum>(ModalTypeEnum.ADD);
    const [concernedProductType, setConcernedProductType] = useState<ProductTypeJson>({name: "", id: 0});
    const { data, isLoading, isError } = useGetProductTypesHook();

    const handleOpenDialogType = (type: ModalTypeEnum, productType: ProductTypeJson) => {
        setConcernedProductType(productType);
        setDialogType(type);
        setOpenDialog(true);
    };

    const filteredProductTypes = data?.filter(pt =>
        pt.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <>
            <Breadcrumb title="Product Types" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <TableCallToActionButton
                                callToActionText="Ajouter Type Produit"
                                callToActionFunction={() => handleOpenDialogType(ModalTypeEnum.ADD, {name: "", id: 0})}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <ProductTypesList
                                isLoading={isLoading}
                                isError={isError}
                                data={filteredProductTypes}
                                handleOpenDialogType={handleOpenDialogType}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <ProductTypeDialog
                concernedProductType={concernedProductType}
                closeDialog={() => setOpenDialog(false)}
                dialogType={dialogType}
                openDialog={openDialog}
            />
        </>
    );
};

export default ProductTypes;
