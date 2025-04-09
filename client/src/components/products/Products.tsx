import React, {useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../common/TableSearch";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {ColorEnum, ModalTypeEnum, ProductJson} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import {useGetProductsHook} from "../../hooks/ProductsHook";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useGetProductTypesHook} from "../../hooks/ProductTypesHook";
import ProductDialog from "./ProductDialog";

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

    let listProducts;

    if (loadingProductsData || loadingProductTypesData) {
        listProducts = <LoadingComponent message="Loading products" />;
    } else if (errorProductsData || errorProductsTypesData) {
        listProducts = <Typography color="error">Error loading products</Typography>;
    } else if (filteredProducts.length === 0) {
        listProducts = <Typography>No product found</Typography>;
    } else {
        listProducts = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Nom Produit</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Taille</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Type</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Quantite</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Seuil</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredProducts.map((type) => (
                        <TableRow key={type.id}>
                            <TableCell>{type.id}</TableCell>
                            <TableCell>{type.name}</TableCell>
                            <TableCell>{type.size || "-"}</TableCell>
                            <TableCell>
                                {productTypesData?.find(pt => pt.id === type.productTypeId)?.name || ""}
                            </TableCell>
                            <TableCell>
                                {(type.color === ColorEnum.UNKNOWN) ? ('') : (
                                    <Box
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            borderRadius: "4px",
                                            backgroundColor: type.color.toLowerCase(),
                                            border: "1px solid #ccc"
                                        }}
                                    />
                                )}
                            </TableCell>
                            <TableCell>{type.totalQuantity}</TableCell>
                            <TableCell>{type.threshold}</TableCell>
                            <TableCell align="right">
                                <Tooltip title="Modifier Type Produit">
                                    <IconButton
                                        color="warning"
                                        onClick={() => {handleOpenDialogType(ModalTypeEnum.UPDATE, type)}}
                                    >
                                        <EditIcon width={22} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer Type Produit">
                                    <IconButton
                                        color="error"
                                        onClick={() => {handleOpenDialogType(ModalTypeEnum.DELETE, type)}}
                                    >
                                        <DeleteIcon width={22} />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

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
                            {listProducts}
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
