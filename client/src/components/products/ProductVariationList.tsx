import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {ModalTypeEnum, ProductVariationJson} from "../../model/KeynoyModels";
import DeleteButton from "../common/buttons/DeleteButton";
import EditButton from "../common/buttons/EditButton";
import ColorBox from "../common/ColorBox";

interface ProductVariationListProps {
    productVariations: ProductVariationJson[];
    onVariationAction: (modalType: ModalTypeEnum, variant: ProductVariationJson) => void;
}

const ProductVariationList: React.FC<ProductVariationListProps> = ({productVariations, onVariationAction}) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Size</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Quantite</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Seuil</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {productVariations.map((variation, index) => (
                    <TableRow key={variation.id}>
                        <TableCell>
                            <Typography color="textSecondary" fontWeight="400">
                                {variation.id}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" fontWeight="400">
                                {variation.name}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" fontWeight="400">
                                {variation.size}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" fontWeight="400">
                                <ColorBox htmlCode={variation.color.htmlCode}/>
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" fontWeight="400">
                                {variation.quantity}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" fontWeight="400">
                                {variation.threshold}
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <EditButton
                                tooltipText={`Modifier Variation`}
                                handleOpenDialogType={() => onVariationAction(ModalTypeEnum.UPDATE, variation)}
                            />
                            <DeleteButton
                                tooltipText={`Supprimer Variation`}
                                handleOpenDialogType={() => onVariationAction(ModalTypeEnum.DELETE, variation)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default ProductVariationList;