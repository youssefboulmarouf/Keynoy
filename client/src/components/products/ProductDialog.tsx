import React, {FC, useEffect, useState} from "react";
import {ModalTypeEnum, ProductJson, ProductTypeJson, ProductVariationJson} from "../../model/KeynoyModels";
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useProductsContext} from "../../context/ProductsContext";
import TableCallToActionButton from "../common/TableCallToActionButton";
import ProductVariationList from "./product-variation/ProductVariationList";
import ProductVariantDialog from "./product-variation/ProductVariationDialog";
import {useColorContext} from "../../context/ColorsContext";
import {getActionButton} from "../common/Utilities";
import {useDialogController} from "../common/useDialogController";

interface ProductDialogProps {
    concernedProduct: ProductJson;
    productsType: ProductTypeJson[];
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
}

const ProductDialog: FC<ProductDialogProps> = ({concernedProduct, productsType, dialogType, openDialog, closeDialog}) => {
    const {colors} = useColorContext();
    const [productName, setProductName] = useState<string>("");
    const [productType, setProductType] = useState<ProductTypeJson | null>(null);
    const [productVariations, setProductVariations] = useState<ProductVariationJson[]>([]);

    const variationDialog = useDialogController<ProductVariationJson>(
        { id: 0, name: "", productId: concernedProduct.id, quantity: 0, threshold: 0, size: "", color: colors[0] }
    );

    const {addProduct, editProduct, removeProduct} = useProductsContext();

    useEffect(() => {
        setProductName(concernedProduct.name);
        setProductType(productsType.find(pt => pt.id === concernedProduct.productTypeId) || null);
        setProductVariations(concernedProduct.productVariations)
    }, [concernedProduct]);

    const handleSubmit = () => {
        if (dialogType === ModalTypeEnum.DELETE) {
            removeProduct(concernedProduct);
            closeDialog()
        } else if (dialogType === ModalTypeEnum.ADD) {
            addProduct({
                id: 0,
                name: productName,
                productTypeId: productType?.id ?? 0,
                productVariations: productVariations
            });
            closeDialog()
        } else {
            editProduct({
                id: concernedProduct.id,
                name: productName,
                productTypeId: productType?.id ?? 0,
                productVariations: productVariations
            });
            closeDialog()
        }
    }

    const actionButton = getActionButton(dialogType, handleSubmit, `${dialogType} Produit`);

    return (
        <>
            <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '900px', maxWidth: '900px'}}}>
                <DialogTitle sx={{ mt: 2 }}>{dialogType} Produit: {concernedProduct.name}</DialogTitle>
                <DialogContent>

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Id</Typography>
                    <TextField fullWidth value={concernedProduct.id === 0 ? "" : concernedProduct.id} disabled/>

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Nom Produit</Typography>
                    <TextField
                        fullWidth
                        value={productName}
                        onChange={(e: any) => setProductName(e.target.value)}
                        disabled={dialogType === ModalTypeEnum.DELETE}
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Type Produit</Typography>
                    <Autocomplete
                        options={productsType}
                        fullWidth
                        getOptionKey={(options) => options.id}
                        getOptionLabel={(options) => options.name}
                        value={productType}
                        onChange={(event: React.SyntheticEvent, newValue: ProductTypeJson | null) =>
                            setProductType(newValue)
                        }
                        renderInput={(params) => <TextField {...params} placeholder="Type Produit" />}
                        disabled={dialogType === ModalTypeEnum.DELETE}
                        sx={{ mb: 2 }}
                    />

                    <TableCallToActionButton
                        fullwidth={true}
                        callToActionText="Ajouter Variation"
                        callToActionFunction={() => variationDialog.openDialog(
                            ModalTypeEnum.ADD,
                            {id: 0, name: "", productId: concernedProduct.id, quantity: 0, threshold: 0, size: "", color: colors[0]}
                        )}
                    />
                    <ProductVariationList
                        productVariations={productVariations}
                        onVariationAction={variationDialog.openDialog}
                    />

                </DialogContent>
                <DialogActions>
                    {actionButton}
                    <Button variant="outlined" onClick={() => closeDialog()}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <ProductVariantDialog
                concernedProductVariant={variationDialog.data}
                productVariations={productVariations}
                product={concernedProduct}
                colors={colors}
                openVariationDialog={variationDialog.open}
                closeDialog={variationDialog.closeDialog}
                dialogType={variationDialog.type}
                setVariation={setProductVariations}
            />
        </>
    );
}

export default ProductDialog;