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

interface ProductTypesListProps {
    loading: boolean;
    error: Error | null;
    data: ProductTypeJson[];
    handleOpenDialogType: (type: ModalTypeEnum, productType: ProductTypeJson) => void;
}

const ProductTypesList: React.FC<ProductTypesListProps> = ({loading, error, data, handleOpenDialogType}) => {
    let listProductsTypes;

    if (loading) {
        listProductsTypes = <LoadingComponent message="Loading product types" />;
    } else if (error) {
        listProductsTypes = <Typography color="error">Error loading product types: {error.message}</Typography>;
    } else if (data.length === 0) {
        listProductsTypes = <Typography>No product types found</Typography>;
    } else {
        listProductsTypes = (
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
                    {data.map((type) => (
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
                                    handleOpenDialogType={() => handleOpenDialogType(ModalTypeEnum.UPDATE, type)}
                                />
                                <DeleteButton
                                    tooltipText={"Supprimer Type Produit"}
                                    handleOpenDialogType={() => handleOpenDialogType(ModalTypeEnum.DELETE, type)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return (<>{listProductsTypes}</>);
}
export default ProductTypesList;