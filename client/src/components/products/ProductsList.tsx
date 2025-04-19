import React from "react";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {ColorEnum, ColorJson, ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Stack, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";
import Box from "@mui/material/Box";

interface ProductsListProps {
    loadingProductsData: boolean;
    loadingProductTypesData: boolean;
    errorProductsData: Error | null;
    errorProductsTypesData: Error | null;
    data: ProductJson[];
    productTypesData: ProductTypeJson[] | undefined;
    handleOpenDialogType: (type: ModalTypeEnum, product: ProductJson) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
    loadingProductsData,
    loadingProductTypesData,
    errorProductsData,
    errorProductsTypesData,
    data,
    productTypesData,
    handleOpenDialogType
}) => {
    let listProducts;

    if (loadingProductsData || loadingProductTypesData) {
        listProducts = <LoadingComponent message="Loading products" />;
    } else if (errorProductsData || errorProductsTypesData) {
        // TODO handles error messages
        listProducts = <Typography color="error">Error loading products</Typography>;
    } else if (data.length === 0) {
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
                    {data.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.size || "-"}</TableCell>
                            <TableCell>
                                {productTypesData?.find(pt => pt.id === product.productTypeId)?.name}
                            </TableCell>
                            <TableCell>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                                    {product.colors.map((color) => (
                                        <Box
                                            key={product.id + color.id}
                                            sx={{
                                                width: 25,
                                                height: 25,
                                                borderRadius: "4px",
                                                backgroundColor: '#' + color.htmlCode,
                                                border: "1px solid #ccc"
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </TableCell>
                            <TableCell>{product.totalQuantity}</TableCell>
                            <TableCell>{product.threshold}</TableCell>
                            <TableCell align="right">
                                <EditButton tooltipText={"Modifier Produit"} entity={product} handleOpenDialogType={handleOpenDialogType}/>
                                <DeleteButton tooltipText={"Supprimer Produit"} entity={product} handleOpenDialogType={handleOpenDialogType}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return (<>{listProducts}</>);
}
export default ProductsList;