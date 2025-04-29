import {ColorJson, ModalTypeEnum, ProductJson, ProductTypeJson, ProductVariationJson} from "../../model/KeynoyModels";
import {Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import ColorBox from "../common/ColorBox";
import {getActionButton} from "../common/Utilities";
import FormLabel from "../common/FormLabel";
import LoadingComponent from "../common/LoadingComponent";

interface ProductVariantDialogProps {
    products: ProductJson[];
    colors: ColorJson[];
    selectedVariant: ProductVariationJson;
    openVariationDialog: boolean;
    closeDialog: () => void;
    dialogType: ModalTypeEnum;
    addVariant: (variation: ProductVariationJson) => void;
    editVariant: (variation: ProductVariationJson) => void;
    removeVariant: (variation: ProductVariationJson) => void;
}

export const ProductVariantDialog: React.FC<ProductVariantDialogProps> = ({
    selectedVariant,
    products,
    colors,
    openVariationDialog,
    closeDialog,
    dialogType,
    addVariant,
    editVariant,
    removeVariant
}) => {
    const [name, setName] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [threshold, setThreshold] = useState<number>(0);
    const [color, setColor] = useState<ColorJson | null>(null);
    const [product, setProduct] = useState<ProductJson | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setName(selectedVariant.name);
        setSize(selectedVariant.size);
        setQuantity(selectedVariant.quantity);
        setThreshold(selectedVariant.threshold);
        setColor(colors.find(c => c.id === selectedVariant.colorId) ?? null)
        setProduct(products.find(p => p.id === selectedVariant.productId) ?? null)
    }, [selectedVariant]);

    const emptyForm = () => {
        setName("");
        setSize("");
        setQuantity(0);
        setThreshold(0);
        setColor(null);

        closeDialog();
    }

    const handleSubmit = async () => {
        if (!color || !product) return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.ADD) {
            await addVariant({
                id: 0,
                name,
                productId: product.id,
                size,
                threshold,
                colorId: color.id,
                quantity
            });
        } else if (dialogType === ModalTypeEnum.DELETE) {
            await removeVariant(selectedVariant);
        } else {
            await editVariant({
                id: selectedVariant.id,
                name,
                productId: product.id,
                size,
                threshold,
                colorId: color.id,
                quantity
            });
        }

        setIsLoading(false);
        emptyForm()
    }

    const actionButton = getActionButton(
        dialogType,
        handleSubmit,
        `${dialogType} Variation`,
        !size || !quantity || !threshold || !color || !product || isLoading
    );

    return (
        <Dialog open={openVariationDialog} onClose={() => emptyForm()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{dialogType} Variation Produit: {selectedVariant.name}</DialogTitle>

            <DialogContent>
                {isLoading ? (
                    <LoadingComponent message="Action en cours" />
                ) : (
                    <Stack spacing={2}>
                        <FormLabel>Id</FormLabel>
                        <TextField fullWidth value={selectedVariant.id === 0 ? "" : selectedVariant.id} disabled/>

                        <FormLabel>Nom Variation</FormLabel>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={(e: any) => setName(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Taille</FormLabel>
                        <TextField
                            fullWidth
                            value={size}
                            onChange={(e: any) => setSize(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Produit</FormLabel>
                        <Autocomplete
                            options={products}
                            fullWidth
                            getOptionLabel={(options) => options.name}
                            value={product}
                            onChange={(event: React.SyntheticEvent, newValue: ProductJson | null) =>
                                setProduct(newValue)
                            }
                            renderInput={(params) => <TextField {...params} placeholder="Type Produit" />}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Couleur</FormLabel>
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

                        <FormLabel>Quantite</FormLabel>
                        <TextField
                            fullWidth
                            value={quantity}
                            onChange={(e: any) => setQuantity(Number(e.target.value))}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Seuil</FormLabel>
                        <TextField
                            fullWidth
                            value={threshold}
                            onChange={(e: any) => setThreshold(Number(e.target.value))}
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
    )
}
export default ProductVariantDialog;