import React from "react";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {ModalTypeEnum, ProductTypeJson} from "../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from "@mui/material/IconButton";
import {usePaginationController} from "../common/usePaginationController";
import Pagination from "../common/Pagination";

interface ProductTypesListProps {
    isLoading: boolean;
    productTypes: ProductTypeJson[];
    openDialogWithType: (type: ModalTypeEnum, productType: ProductTypeJson) => void;
}

const ProductTypesList: React.FC<ProductTypesListProps> = ({isLoading, productTypes, openDialogWithType}) => {
    const paginationController = usePaginationController<ProductTypeJson>(productTypes);

    if (isLoading) return <LoadingComponent message="Loading product types" />;
    if (productTypes.length === 0) return <Typography>No product types found</Typography>;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Type Produits</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Vendable</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Peinture</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginationController.data.map((type) => (
                    <TableRow key={type.id}>
                        <TableCell>{type.id}</TableCell>
                        <TableCell>{type.name}</TableCell>
                        <TableCell>
                            {type.isSellable ? (
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
                            {type.isPaint ? (
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
                                tooltipText={"Modifier Type Produit"}
                                openDialogWithType={() => openDialogWithType(ModalTypeEnum.UPDATE, type)}
                            />
                            <DeleteButton
                                tooltipText={"Supprimer Type Produit"}
                                openDialogWithType={() => openDialogWithType(ModalTypeEnum.DELETE, type)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Pagination paginationController={paginationController} />
        </Table>
    );
}
export default ProductTypesList;