import {FC, useEffect, useState} from "react";
import {ColorJson, ModalTypeEnum, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ColorGrid from "./ColorGrid";
import {useProductsContext} from "../../context/ProductsContext";

interface ProductDialogProps {
    concernedProduct: ProductJson;
    productsType: ProductTypeJson[];
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
}

const ProductDialog: FC<ProductDialogProps> = ({concernedProduct, productsType, dialogType, openDialog, closeDialog}) => {
    const [productName, setProductName] = useState<string>("");
    const [productSize, setProductSize] = useState<string>("");
    const [productSeuil, setProductSeuil] = useState<number>(0);
    const [productQuantity, setProductQuantity] = useState<number>(0);
    const [productType, setProductType] = useState<ProductTypeJson | null>(null);
    const [colors, setColors] = useState<ColorJson[]>([]);

    const {addProduct, editProduct, removeProduct} = useProductsContext();

    useEffect(() => {
        setProductName(concernedProduct.name);
        setProductSize(concernedProduct.size);
        setProductSeuil(concernedProduct.threshold);
        setProductQuantity(concernedProduct.totalQuantity);
        setColors(concernedProduct.colors);
        setProductType(productsType.find(pt => pt.id === concernedProduct.productTypeId) || null);

        console.log("concernedProduct.colors : ", concernedProduct.colors)
    }, [concernedProduct]);

    const handleSubmit = () => {
        if (dialogType === ModalTypeEnum.DELETE) {
            removeProduct(concernedProduct);
            closeDialog()
        } else if (dialogType === ModalTypeEnum.ADD) {
            addProduct({
                id: 0,
                name: productName,
                size: productSize,
                productTypeId: productType?.id ?? 0,
                colors: colors,
                threshold: productSeuil,
                totalQuantity: productQuantity
            });
            closeDialog()
        } else {
            editProduct({
                id: concernedProduct.id,
                name: productName,
                size: productSize,
                productTypeId: productType?.id ?? 0,
                colors: colors,
                threshold: productSeuil,
                totalQuantity: productQuantity
            });
            closeDialog()
        }
    }

    const actionText = `${dialogType} Produit`;
    let actionButton;
    if (dialogType === ModalTypeEnum.DELETE) {
        actionButton = <Button variant="contained" color="error" onClick={handleSubmit}>{actionText}</Button>
    } else if (dialogType === ModalTypeEnum.ADD) {
        actionButton = <Button variant="contained" color="primary" onClick={handleSubmit}>{actionText}</Button>
    } else {
        actionButton = <Button variant="contained" color="warning" onClick={handleSubmit}>{actionText}</Button>
    }

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '700px', maxWidth: '700px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{actionText}</DialogTitle>
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

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Taille Produit</Typography>
                <TextField
                    fullWidth
                    value={productSize}
                    onChange={(e: any) => setProductSize(e.target.value)}
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
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Couleur Produit</Typography>
                <ColorGrid productColors={colors} onChange={setColors} disabled={dialogType === ModalTypeEnum.DELETE}/>

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Quantite Produit</Typography>
                <TextField
                    fullWidth
                    value={productQuantity}
                    onChange={(e: any) => setProductQuantity(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Seuil Produit</Typography>
                <TextField
                    fullWidth
                    value={productSeuil}
                    onChange={(e: any) => setProductSeuil(e.target.value)}
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

export default ProductDialog;