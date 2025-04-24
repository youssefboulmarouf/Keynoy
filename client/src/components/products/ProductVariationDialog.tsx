import {ColorJson, ModalTypeEnum, ProductJson, ProductVariationJson} from "../../model/KeynoyModels";
import {Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import ColorBox from "../common/ColorBox";
import {getActionButton} from "../common/Utilities";

interface ProductVariantDialogProps {
    concernedProductVariant: ProductVariationJson;
    productVariations: ProductVariationJson[];
    product: ProductJson;
    colors: ColorJson[];
    openVariationDialog: boolean;
    closeDialog: () => void;
    dialogType: ModalTypeEnum;
    setVariation: (variations: ProductVariationJson[]) => void;

}

export const ProductVariantDialog: React.FC<ProductVariantDialogProps> = ({
    concernedProductVariant,
    productVariations,
    product,
    colors,
    openVariationDialog,
    closeDialog,
    dialogType,
    setVariation
}) => {
    const [name, setName] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [threshold, setThreshold] = useState<number>(0);
    const [color, setColor] = useState<ColorJson | null>(null);

    useEffect(() => {
        setName(concernedProductVariant.name);
        setSize(concernedProductVariant.size);
        setQuantity(concernedProductVariant.quantity);
        setThreshold(concernedProductVariant.threshold);
        setColor(concernedProductVariant.color)
    }, [concernedProductVariant]);

    const handleSubmit = () => {
        if (dialogType === ModalTypeEnum.ADD) {
            setVariation([
                ...productVariations,
                {id: 0, name, productId: product.id, size, threshold, color: (color ?? colors[0]), quantity},
            ]);
        } else if (dialogType === ModalTypeEnum.DELETE) {
            setVariation(productVariations.filter(v => v.id !== concernedProductVariant.id));
        } else {
            setVariation([
                ...productVariations.filter(v => v.id !== concernedProductVariant.id),
                {id: concernedProductVariant.id, name, productId: product.id, size, threshold, color: (color ?? colors[0]), quantity},
            ]);
        }

        setName("");
        setSize("");
        setQuantity(0);
        setThreshold(0);
        setColor(null);

        closeDialog();
    }

    const actionButton = getActionButton(dialogType, handleSubmit, `${dialogType} Variation`);

    return (
        <Dialog open={openVariationDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{dialogType} Variation Produit: {concernedProductVariant.name}</DialogTitle>

            <DialogContent>

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Id</Typography>
                <TextField fullWidth value={concernedProductVariant.id === 0 ? "" : concernedProductVariant.id} disabled/>

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Nom Variation</Typography>
                <TextField
                    fullWidth
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Taille</Typography>
                <TextField
                    fullWidth
                    value={size}
                    onChange={(e: any) => setSize(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Couleur</Typography>
                <Autocomplete
                    options={colors}
                    fullWidth
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={color}
                    onChange={(event: React.SyntheticEvent, newValue: ColorJson | null) => setColor(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={!color ? "Couleur" : ""}
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ColorBox htmlCode={option.htmlCode}/>
                                <Typography variant="body2">{option.name}</Typography>
                            </Stack>
                        </li>
                    )}
                    renderValue={(selected: ColorJson) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <ColorBox htmlCode={selected.htmlCode}/>
                            <Typography variant="body2">{selected.name}</Typography>
                        </Stack>
                    )}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                    sx={{ mb: 2 }}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Quantite</Typography>
                <TextField
                    fullWidth
                    value={quantity}
                    onChange={(e: any) => setQuantity(Number(e.target.value))}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Seuil</Typography>
                <TextField
                    fullWidth
                    value={threshold}
                    onChange={(e: any) => setThreshold(Number(e.target.value))}
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
    )
}
export default ProductVariantDialog;