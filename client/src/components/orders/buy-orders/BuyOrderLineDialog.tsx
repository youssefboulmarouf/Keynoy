import {
    ColorJson,
    CompanyDesignJson,
    OrderLineJson,
    OrderLineProductVariationJson,
    ProductJson,
    ProductTypeJson,
    ProductVariationJson
} from "../../../model/KeynoyModels";
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import ColorBox from "../../common/ColorBox";
import OrderDesignGrid from "../order-components/OrderDesignGrid";
import FormLabel from "../../common/FormLabel";
import OrderPaintGrid from "../order-components/OrderPaintGrid";
import NumberField from "../../common/NumberField";

interface SellOrderLineDialogProps {
    openDialog: boolean;
    closeDialog: () => void;
    productTypes: ProductTypeJson[];
    products: ProductJson[];
    variations: ProductVariationJson[]
    colors: ColorJson[];
    addOrderLine: (orderLine: OrderLineJson) => void;
}

const BuyOrderLineDialog: React.FC<SellOrderLineDialogProps> = ({
    openDialog,
    closeDialog,
    productTypes,
    products,
    variations,
    colors,
    addOrderLine
}) => {
    const [selectedProductType, setSelectedProductType] = useState<ProductTypeJson | null>(null);
    const [narrowProducts, setNarrowProducts] = useState<ProductJson[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductJson | null>(null);
    const [narrowVariation, setNarrowVariation] = useState<ProductVariationJson[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariationJson | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        setNarrowProducts(products.filter(p => p.productTypeId === selectedProductType?.id));
    }, [selectedProductType]);

    useEffect(() => {
        setNarrowVariation(variations.filter(v => v.productId === selectedProduct?.id));
    }, [selectedProduct]);

    const handleAddOrderLine = () => {
        if (selectedVariant) {
            const orderLine: OrderLineJson = {
                id: 0,
                orderId: 0,
                designId: null,
                orderLineProductVariations: buildOrderLineProductVariations()
            }

            addOrderLine(orderLine)
            handleCloseDialog();
        }
    }

    const buildOrderLineProductVariations = () => {
        const orderLineProductVariations: OrderLineProductVariationJson[] = [];
        if (selectedVariant) {
            orderLineProductVariations.push({
                orderLineId: 0,
                productVariationId: selectedVariant.id,
                quantity: quantity,
                unitPrice: unitPrice
            })
            return orderLineProductVariations;
        }

        return [];
    }

    const handleQuantityChange = (q: number) => {
        setQuantity(q)
        setTotalPrice(q * unitPrice)
    }

    const handleUnitPriceChange = (p: number) => {
        setUnitPrice(p)
        setTotalPrice(p * quantity)
    }

    const handleTotalPriceChange = (p: number) => {
        setTotalPrice(p)
        if (quantity > 0) {
            setUnitPrice(p / quantity)
        }
    }

    const handleCloseDialog = () => {
        setSelectedProductType(null);
        setSelectedProduct(null);
        setSelectedVariant(null);
        setQuantity(0);
        setUnitPrice(0);
        setTotalPrice(0);
        closeDialog();
    }

    return (
        <Dialog open={openDialog} onClose={() => handleCloseDialog()} PaperProps={{sx: {width: '900px', maxWidth: '900px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{"Ajouter Ligne Commande"}</DialogTitle>

            <DialogContent>
                <FormLabel>Type Produit</FormLabel>
                <Autocomplete
                    options={productTypes}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={selectedProductType}
                    onChange={(event: React.SyntheticEvent, newValue: ProductTypeJson | null) => {
                        setSelectedProductType(newValue)
                        setSelectedProduct(null)
                        setSelectedVariant(null)
                        setQuantity(0)
                        setUnitPrice(0)
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Type Produit" />}
                />

                <FormLabel>Produit</FormLabel>
                <Autocomplete
                    options={narrowProducts}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={selectedProduct}
                    onChange={(event: React.SyntheticEvent, newValue: ProductJson | null) => {
                        setSelectedProduct(newValue)
                        setSelectedVariant(null)
                        setQuantity(0)
                        setUnitPrice(0)
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Produit" />}
                />

                <FormLabel>Variation</FormLabel>
                <Autocomplete
                    options={narrowVariation}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.size}
                    value={selectedVariant}
                    onChange={(event: React.SyntheticEvent, newValue: ProductVariationJson | null) => {
                        setSelectedVariant(newValue);
                        setQuantity(0)
                        setUnitPrice(0)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={!selectedVariant ? "Variation" : ""}
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ColorBox htmlCode={colors.find(c => c.id === option.colorId)?.htmlCode ?? ""}/>
                                <Typography variant="body2">{option.name}</Typography>
                            </Stack>
                        </li>
                    )}
                    renderValue={(selected: ProductVariationJson) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <ColorBox htmlCode={colors.find(c => c.id === selected.colorId)?.htmlCode ?? ""}/>
                            <Typography variant="body2">{selected.name}</Typography>
                        </Stack>
                    )}
                />

                <FormLabel>Quantite</FormLabel>
                <NumberField
                    value={quantity}
                    onChange={handleQuantityChange}
                />

                <FormLabel>Prix Unitaire</FormLabel>
                <NumberField
                    value={unitPrice}
                    onChange={handleUnitPriceChange}
                />

                <FormLabel>Prix Totale</FormLabel>
                <NumberField
                    value={totalPrice}
                    onChange={handleTotalPriceChange}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddOrderLine()}
                >Ajouter Ligne Commande</Button>
                <Button variant="outlined" onClick={() => handleCloseDialog()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default BuyOrderLineDialog;
