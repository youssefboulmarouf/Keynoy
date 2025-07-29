import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import React, {FC, useEffect, useState} from "react";
import {ModalTypeEnum, ProductTypeJson} from "../../model/KeynoyModels";
import {useProductTypesContext} from "../../context/ProductTypesContext";
import {getActionButton} from "../common/Utilities";
import FormLabel from "../common/FormLabel";
import LoadingComponent from "../common/LoadingComponent";

interface ProductTypeDialogProps {
    concernedProductType: ProductTypeJson;
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
}

const ProductTypeDialog: FC<ProductTypeDialogProps> = ({concernedProductType, dialogType, openDialog, closeDialog}) => {
    const { addProductType, editProductType, removeProductType } = useProductTypesContext();
    const [productTypeName, setProductTypeName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setProductTypeName(concernedProductType.name);
    }, [concernedProductType]);

    const handleSubmit = async () => {
        if (!productTypeName) return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeProductType(concernedProductType);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addProductType({
                id: 0,
                name: productTypeName
            });
        } else {
            await editProductType({
                id: concernedProductType.id,
                name: productTypeName
            });
        }

        emptyForm();
        setIsLoading(false);
    }
    
    const emptyForm = () => {
        setProductTypeName("");

        closeDialog();
    }

    const actionButton = getActionButton(dialogType, handleSubmit, `${dialogType} Type Produit`);
    
    return (
        <Dialog open={openDialog} onClose={() => emptyForm()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{`${dialogType} Type Produit`}</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <LoadingComponent message="Action en cours" />
                ) : (
                    <Stack spacing={2}>
                        <FormLabel>Id</FormLabel>
                        <TextField
                            fullWidth
                            value={concernedProductType.id === 0 ? "" : concernedProductType.id}
                            disabled
                        />

                        <FormLabel>Nom Type Produit</FormLabel>
                        <TextField
                            fullWidth
                            value={productTypeName}
                            onChange={(e: any) => setProductTypeName(e.target.value)}
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

export default ProductTypeDialog;