import React, {FC, useEffect, useState} from "react";
import {ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Switch, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {getActionButton} from "../common/Utilities";
import FormLabel from "../common/FormLabel";
import LoadingComponent from "../common/LoadingComponent";

interface ProductDialogProps {
    selectedProduct: ProductJson;
    productsType: ProductTypeJson[];
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
    addProduct: (productJson: ProductJson) => void;
    editProduct: (productJson: ProductJson) => void;
    removeProduct: (productJson: ProductJson) => void;
}

const ProductDialog: FC<ProductDialogProps> = ({
    selectedProduct,
    productsType,
    dialogType,
    openDialog,
    closeDialog,
    addProduct,
    editProduct,
    removeProduct
}) => {
    const [productName, setProductName] = useState<string>("");
    const [sellable, setSellable] = useState<boolean>(false);
    const [layer, setLayer] = useState<boolean>(false);
    const [productType, setProductType] = useState<ProductTypeJson | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setProductName(selectedProduct.name);
        setSellable(selectedProduct.isSellable);
        setLayer(selectedProduct.isLayer);
        setProductType(productsType.find(pt => pt.id === selectedProduct.productTypeId) || null);
    }, [selectedProduct]);

    const handleSubmit = async () => {
        if (!productType) return;
        if (!productName) return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeProduct(selectedProduct);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addProduct({
                id: 0,
                name: productName,
                isSellable: sellable,
                isLayer: layer,
                productTypeId: productType.id
            });
        } else {
            await editProduct({
                id: selectedProduct.id,
                name: productName,
                isSellable: sellable,
                isLayer: layer,
                productTypeId: productType.id
            });
        }

        emptyForm();
        setIsLoading(false);
    };

    const emptyForm = () => {
        setProductName("");
        setSellable(false);
        setLayer(false);
        setProductType(null);

        closeDialog();
    }

    const actionButton = getActionButton(
        dialogType,
        handleSubmit,
        `${dialogType} Produit`,
        !productType || productName === "" || isLoading
    );

    return (
        <Dialog open={openDialog} onClose={() => emptyForm()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{dialogType} Produit: {selectedProduct.name}</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <LoadingComponent message="Action en cours" />
                ) : (
                    <Stack spacing={2}>
                        <FormLabel>Id</FormLabel>
                        <TextField fullWidth value={selectedProduct.id === 0 ? "" : selectedProduct.id} disabled />

                        <FormLabel>Nom Produit</FormLabel>
                        <TextField
                            fullWidth
                            value={productName}
                            onChange={(e: any) => setProductName(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Type Produit</FormLabel>
                        <Autocomplete
                            options={productsType}
                            fullWidth
                            getOptionLabel={(options) => options.name}
                            value={productType}
                            onChange={(event: React.SyntheticEvent, newValue: ProductTypeJson | null) =>
                                setProductType(newValue)
                            }
                            renderInput={(params) => <TextField {...params} placeholder="Type Produit" />}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Vendable</FormLabel>
                        <Switch
                            checked={sellable}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                                setSellable(checked)
                            }
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Calque</FormLabel>
                        <Switch
                            checked={layer}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                                setLayer(checked)
                            }
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                {actionButton}
                <Button variant="outlined" onClick={() => emptyForm()}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductDialog;