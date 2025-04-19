import {Dialog, DialogActions, DialogContent, DialogTitle, Switch, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {FC, useEffect, useState} from "react";
import {ModalTypeEnum, ProductTypeJson} from "../../model/KeynoyModels";
import {useProductTypesContext} from "../../context/ProductTypesContext";

interface ProductTypeDialogProps {
    concernedProductType: ProductTypeJson;
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
}

const ProductTypeDialog: FC<ProductTypeDialogProps> = ({concernedProductType, dialogType, openDialog, closeDialog}) => {
    const { addProductType, editProductType, removeProductType } = useProductTypesContext();
    const [productTypeName, setProductTypeName] = useState<string>("");
    const [productTypeSellable, setProductTypeSellable] = useState<boolean>(false);

    useEffect(() => {
        setProductTypeName(concernedProductType.name);
        setProductTypeSellable(concernedProductType.sellable);
    }, [concernedProductType]);

    const handleSubmit = async () => {
        if (dialogType === ModalTypeEnum.DELETE) {
            removeProductType(concernedProductType);
        } else if (dialogType === ModalTypeEnum.ADD) {
            addProductType({ id: 0, name: productTypeName, sellable: productTypeSellable });
        } else {
            editProductType({ id: concernedProductType.id, name: productTypeName, sellable: productTypeSellable});
        }
        closeDialog();
    }

    const actionText = `${dialogType} Type Produit`;
    let actionButton;
    if (dialogType === ModalTypeEnum.DELETE) {
        actionButton = <Button variant="contained" color="error" onClick={handleSubmit}>{actionText}</Button>
    } else if (dialogType === ModalTypeEnum.ADD) {
        actionButton = <Button variant="contained" color="primary" onClick={handleSubmit}>{actionText}</Button>
    } else {
        actionButton = <Button variant="contained" color="warning" onClick={handleSubmit}>{actionText}</Button>
    }

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{actionText}</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Id</Typography>
                <TextField fullWidth value={concernedProductType.id === 0 ? "" : concernedProductType.id} disabled/>

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Nom Type Produit</Typography>
                <TextField
                    fullWidth
                    value={productTypeName}
                    onChange={(e: any) => setProductTypeName(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Vendable</Typography>
                <Switch
                    checked={productTypeSellable}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                        setProductTypeSellable(checked)
                    }
                    disabled={dialogType === ModalTypeEnum.DELETE}
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