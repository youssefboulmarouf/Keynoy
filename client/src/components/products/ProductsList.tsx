import React from "react";
import Typography from "@mui/material/Typography";
import {ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from "@mui/material";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";
import LoadingComponent from "../common/LoadingComponent";
import {usePaginationController} from "../common/usePaginationController";

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
    const paginationController = usePaginationController(products.length);

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
                {(paginationController.rowsPerPage > 0
                    ? products.slice(paginationController.sliceFrom(), paginationController.sliceTo())
                    : products).map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                            {productTypes?.find(pt => pt.id === product.productTypeId)?.name}
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
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={paginationController.rowsPerPageOptions}
                        count={paginationController.count}
                        rowsPerPage={paginationController.rowsPerPage}
                        page={paginationController.page}
                        onPageChange={paginationController.changePage}
                        onRowsPerPageChange={paginationController.changeRowsPerPage}
                    />
                </TableRow>
            </TableFooter>
        </Table>
    );
}
export default ProductsList;