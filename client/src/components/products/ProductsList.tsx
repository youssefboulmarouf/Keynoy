import React from "react";
import Typography from "@mui/material/Typography";
import {ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";
import LoadingComponent from "../common/LoadingComponent";

interface ProductsListProps {
    products: ProductJson[];
    productTypesData: ProductTypeJson[] | undefined;
    openDialogWithType: (type: ModalTypeEnum, product: ProductJson) => void;
    isLoading: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({
    products,
    productTypesData,
    openDialogWithType,
    isLoading
}) => {

    if (isLoading) return <LoadingComponent message="Chargement de produit" />;
    if (products.length === 0) return <Typography>Aucun Produit Trouver</Typography>;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Produit</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Type</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                            {productTypesData?.find(pt => pt.id === product.productTypeId)?.name}
                        </TableCell>
                        <TableCell align="right">
                            <EditButton
                                tooltipText={"Modifier Produit"}
                                openDialogWithType={() => openDialogWithType(ModalTypeEnum.UPDATE, product)}
                            />
                            <DeleteButton
                                tooltipText={"Supprimer Produit"}
                                openDialogWithType={() => openDialogWithType(ModalTypeEnum.DELETE, product)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
export default ProductsList;