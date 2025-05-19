import React from "react";
import Typography from "@mui/material/Typography";
import {ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";
import LoadingComponent from "../common/LoadingComponent";
import {usePaginationController} from "../common/usePaginationController";
import Pagination from "../common/Pagination";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

interface ProductsListProps {
    products: ProductJson[];
    productTypes: ProductTypeJson[] | undefined;
    openDialogWithType: (type: ModalTypeEnum, product: ProductJson) => void;
    isLoading: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({
    products,
    productTypes,
    openDialogWithType,
    isLoading
}) => {
    const paginationController = usePaginationController<ProductJson>(products);

    if (isLoading) return <LoadingComponent message="Chargement de produit" />;
    if (products.length === 0) return <Typography>Aucun Produit Trouver</Typography>;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Produit</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Type</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Vendable</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Calque</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginationController.data.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                            {productTypes?.find(pt => pt.id === product.productTypeId)?.name}
                        </TableCell>
                        <TableCell>
                            {product.isSellable ? (
                                <IconButton color="success">
                                    <CheckIcon width={22} />
                                </IconButton>
                            ) : (
                                <IconButton color="error">
                                    <ClearIcon width={22} />
                                </IconButton>
                            )}
                        </TableCell>
                        <TableCell>
                            {product.isLayer ? (
                                <IconButton color="success">
                                    <CheckIcon width={22} />
                                </IconButton>
                            ) : (
                                <IconButton color="error">
                                    <ClearIcon width={22} />
                                </IconButton>
                            )}
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
            <Pagination paginationController={paginationController} />
        </Table>
    );
}
export default ProductsList;