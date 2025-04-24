import React from "react";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";

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
                        <TableCell><Typography variant="h6" fontSize="14px">Type</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Variations</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                                {productTypesData?.find(pt => pt.id === product.productTypeId)?.name}
                            </TableCell>
                            <TableCell>{product.productVariations.length}</TableCell>
                            <TableCell align="right">
                                <EditButton
                                    tooltipText={"Modifier Produit"}
                                    handleOpenDialogType={() => handleOpenDialogType(ModalTypeEnum.UPDATE, product)}
                                />
                                <DeleteButton
                                    tooltipText={"Supprimer Produit"}
                                    handleOpenDialogType={() => handleOpenDialogType(ModalTypeEnum.DELETE, product)}
                                />
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