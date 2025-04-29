import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import {ColorJson, ModalTypeEnum, ProductJson, ProductVariationJson} from "../../model/KeynoyModels";
import DeleteButton from "../common/buttons/DeleteButton";
import EditButton from "../common/buttons/EditButton";
import ColorBox from "../common/ColorBox";
import {usePaginationController} from "../common/usePaginationController";
import Pagination from "../common/Pagination";

interface ProductVariationListProps {
    productVariations: ProductVariationJson[];
    products: ProductJson[];
    colors: ColorJson[];
    openDialogWithType: (modalType: ModalTypeEnum, variant: ProductVariationJson) => void;
}

const ProductVariationList: React.FC<ProductVariationListProps> = ({
    productVariations,
    products,
    colors,
    openDialogWithType
}) => {
    const paginationController = usePaginationController<ProductVariationJson>(productVariations);
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Variation</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Produit</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Size</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Quantite</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Seuil</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginationController.data.map((variation, index) => (
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
                                {products.find(p => p.id === variation.productId)?.name}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography color="textSecondary" fontWeight="400">
                                {variation.size}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <ColorBox htmlCode={colors.find(c => c.id === variation.colorId)?.htmlCode ?? ""}/>
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
                                openDialogWithType={() => openDialogWithType(ModalTypeEnum.UPDATE, variation)}
                            />
                            <DeleteButton
                                tooltipText={`Supprimer Variation`}
                                openDialogWithType={() => openDialogWithType(ModalTypeEnum.DELETE, variation)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Pagination paginationController={paginationController}/>
        </Table>
    );
}

export default ProductVariationList;