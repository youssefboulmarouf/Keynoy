import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, Switch, TextField} from "@mui/material";
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
    const [productTypePrintable, setProductTypePrintable] = useState<boolean>(false);
    const [productTypePaint, setProductTypePaint] = useState<boolean>(false);
    const [productTypeTool, setProductTypeTool] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setProductTypeName(concernedProductType.name);
        setProductTypePrintable(concernedProductType.isPrintable);
        setProductTypePaint(concernedProductType.isPaint);
        setProductTypeTool(concernedProductType.isTool);
    }, [concernedProductType]);

    const handleSubmit = async () => {
        if (!productTypeName) return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeProductType(concernedProductType);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addProductType({
                id: 0,
                name: productTypeName,
                isPrintable: productTypePrintable,
                isPaint: productTypePaint,
                isTool: productTypeTool
            });
        } else {
            await editProductType({
                id: concernedProductType.id,
                name: productTypeName,
                isPrintable: productTypePrintable,
                isPaint: productTypePaint,
                isTool: productTypeTool
            });
        }

        emptyForm();
        setIsLoading(false);
    }
    
    const emptyForm = () => {
        setProductTypeName("");
        setProductTypePrintable(false);
        setProductTypePaint(false);
        setProductTypeTool(false);

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

                        <FormLabel>Support Impresseion</FormLabel>
                        <Switch
                            checked={productTypePrintable}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                                setProductTypePrintable(checked)
                            }
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Peinture</FormLabel>
                        <Switch
                            checked={productTypePaint}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                                setProductTypePaint(checked)
                            }
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Outils</FormLabel>
                        <Switch
                            checked={productTypeTool}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                                setProductTypeTool(checked)
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

export default ProductTypeDialog;