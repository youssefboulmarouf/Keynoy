import React from "react";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {ModalTypeEnum, ProductTypeJson} from "../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";

interface ProductTypesListProps {
    isLoading: boolean;
    isError: boolean;
    data: ProductTypeJson[];
    handleOpenDialogType: (type: ModalTypeEnum, productType: ProductTypeJson) => void;
}

const ProductTypesList: React.FC<ProductTypesListProps> = ({isLoading, isError, data, handleOpenDialogType}) => {
    let listProductsTypes;

    if (isLoading) {
        listProductsTypes = <LoadingComponent message="Loading product types" />;
    } else if (isError) {
        listProductsTypes = <Typography color="error">Error loading product types</Typography>;
    } else if (data.length === 0) {
        listProductsTypes = <Typography>No product types found</Typography>;
    } else {
        listProductsTypes = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Type Produits</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((type) => (
                        <TableRow key={type.id}>
                            <TableCell>{type.id}</TableCell>
                            <TableCell>{type.name}</TableCell>
                            <TableCell align="right">
                                <EditButton tooltipText={"Modifier Type Produit"} entity={type} handleOpenDialogType={handleOpenDialogType}/>
                                <DeleteButton tooltipText={"Supprimer Type Produit"} entity={type} handleOpenDialogType={handleOpenDialogType}/>
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