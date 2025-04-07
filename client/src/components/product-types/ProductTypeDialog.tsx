import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {FC, useEffect, useState} from "react";
import {ProductTypeJson} from "../../model/KeynoyModels";
import {
    useCreateProductTypeHook,
    useDeleteProductTypeHook,
    useUpdateProductTypeHook
} from "../../hooks/ProductTypesHook";
import LoadingComponent from "../common/LoadingComponent";

interface ProductTypeDialogProps {
    concernedProductType: ProductTypeJson;
    dialogType: string;
    openDialog: boolean;
    closeDialog: () => void;
}

const ProductTypeDialog: FC<ProductTypeDialogProps> = ({concernedProductType, dialogType, openDialog, closeDialog}) => {
    const [productTypeName, setProductTypeName] = useState<string>("");

    const { mutate: updateProductType, isPending: pendingUpdate} = useUpdateProductTypeHook();
    const { mutate: createProductType, isPending: pendingAdd} = useCreateProductTypeHook();
    const { mutate: deleteProductType, isPending: pendingDelete} = useDeleteProductTypeHook();

    useEffect(() => {
        setProductTypeName(concernedProductType.name);
    }, [concernedProductType]);

    const handleSubmit = () => {
        if (dialogType === 'Supprimer') {
            deleteProductType(
                { id: concernedProductType.id, name: productTypeName },
                { onSuccess: () => { closeDialog() }}
            );
        } else if (dialogType === 'Ajouter') {
            createProductType(
                { id: 0, name: productTypeName },
                { onSuccess: () => { closeDialog() }}
            );
        } else {
            updateProductType(
                { id: concernedProductType.id, name: productTypeName },
                { onSuccess: () => { closeDialog() }}
            );
        }
    }

    let actionText = `${dialogType} Type Produit`;
    let actionButton;
    if (dialogType === 'Supprimer') {
        actionButton = <Button variant="contained" color="error" onClick={handleSubmit}>{actionText}</Button>
    } else if (dialogType === 'Ajouter') {
        actionButton = <Button variant="contained" color="primary" onClick={handleSubmit}>{actionText}</Button>
    } else {
        actionButton = <Button variant="contained" color="warning" onClick={handleSubmit}>{actionText}</Button>
    }

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()}>
            <DialogTitle sx={{ width: "500px", mt: 2 }}>{actionText}</DialogTitle>
            <DialogContent>

                {(pendingUpdate || pendingAdd || pendingDelete) ? (<LoadingComponent message={''}/>) : ('')}

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Id</Typography>
                <TextField fullWidth value={concernedProductType.id === 0 ? "" : concernedProductType.id} disabled/>

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Nom Type Produit</Typography>
                <TextField
                    fullWidth
                    value={productTypeName}
                    onChange={(e: any) => setProductTypeName(e.target.value)}
                    disabled={dialogType === 'Supprimer' || (pendingUpdate || pendingAdd || pendingDelete)}
                />
            </DialogContent>
            <DialogActions>
                {actionButton}
                <Button variant="outlined" onClick={() => closeDialog()}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductTypeDialog;