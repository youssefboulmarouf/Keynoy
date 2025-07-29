import {
    ColorJson,
    CompanyDesignJson, OrderLineConsumedVariationJson,
    OrderLineJson,
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
    products: ProductJson[];
    variations: ProductVariationJson[]
    colors: ColorJson[];
    designs: CompanyDesignJson[];
    addOrderLine: (orderLine: OrderLineJson) => void;
}

const SellOrderLineDialog: React.FC<SellOrderLineDialogProps> = ({
    openDialog,
    closeDialog,
    products,
    variations,
    colors,
    designs,
    addOrderLine
}) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductJson | null>(null);
    const [narrowVariation, setNarrowVariation] = useState<ProductVariationJson[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariationJson | null>(null);
    const [paintProducts, setPaintProducts] = useState<ProductJson[]>([]);
    const [selectedPaintVariations, setSelectedPaintVariations] = useState<ProductVariationJson[]>([]);
    const [paintSupportVariations, setPaintSupportVariations] = useState<ProductVariationJson[]>([]);
    const [selectedPaintSupportVariation, setSelectedPaintSupportVariation] = useState<ProductVariationJson | null>(null);
    const [calqueVariations, setCalqueVariations] = useState<ProductVariationJson[]>([]);
    const [selectedCalqueVariation, setSelectedCalqueVariation] = useState<ProductVariationJson | null>(null);
    const [calqueQuantity, setCalqueQuantity] = useState<number>(0);
    const [selectedCompanyDesign, setSelectedCompanyDesign] = useState<CompanyDesignJson | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        setPaintProducts(products.filter(p => p.isPaint));

        const paintSupportProductIds = products.filter(p => p.isPaintTool).map(p => p.id);
        setPaintSupportVariations(variations.filter(v => paintSupportProductIds.includes(v.productId)))

        const calqueProductIds = products.filter(p => p.isLayer).map(p => p.id);
        setCalqueVariations(variations.filter(v => calqueProductIds.includes(v.productId)));
    }, [products]);

    useEffect(() => {
        setNarrowVariation(variations.filter(v => v.productId === selectedProduct?.id));
    }, [selectedProduct]);

    const handleAddOrderLine = () => {
        if (selectedVariant && selectedCompanyDesign && selectedPaintVariations.length > 0) {
            const orderLine: OrderLineJson = {
                id: 0,
                orderId: 0,
                designId: selectedCompanyDesign.id,
                productVariationId: selectedVariant.id,
                quantity: quantity,
                finalQuantity: 0,
                unitPrice: unitPrice,
                orderLineConsumedVariations: buildOrderLineConsumedVariations()
            }

            addOrderLine(orderLine)
            handleCloseDialog();
        }
    }

    const buildOrderLineConsumedVariations = () => {
        const orderLineProductVariations: OrderLineConsumedVariationJson[] = [];
        if (selectedVariant && selectedCalqueVariation && selectedPaintVariations.length > 0) {
            selectedPaintVariations.forEach(spp => {
                orderLineProductVariations.push({
                    orderLineId: 0,
                    productVariationId: spp?.id,
                    quantity: 0,
                    finalQuantity: 0
                })
            })

            orderLineProductVariations.push({
                orderLineId: 0,
                productVariationId: selectedCalqueVariation.id,
                quantity: calqueQuantity,
                finalQuantity: 0
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
        setSelectedProduct(null);
        setSelectedVariant(null);
        setSelectedCalqueVariation(null);
        setSelectedPaintSupportVariation(null);
        setSelectedCompanyDesign(null);
        setCalqueQuantity(0);
        setQuantity(0);
        setUnitPrice(0);
        setTotalPrice(0);
        closeDialog();
    }

    return (
        <Dialog open={openDialog} onClose={() => handleCloseDialog()} PaperProps={{sx: {width: '900px', maxWidth: '900px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{"Ajouter Ligne Commande"}</DialogTitle>

            <DialogContent>
                <FormLabel>Produit</FormLabel>
                <Autocomplete
                    options={products.filter(p => p.isSellable)}
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

                <FormLabel>Peinture</FormLabel>
                <OrderPaintGrid
                    paintProducts={paintProducts}
                    variations={variations}
                    colors={colors}
                    selectedPaintVariations={selectedPaintVariations}
                    setSelectedPaintVariations={setSelectedPaintVariations}
                />

                <FormLabel>Outils Peinture</FormLabel>
                <Autocomplete
                    options={paintSupportVariations}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={selectedPaintSupportVariation}
                    onChange={(event: React.SyntheticEvent, newValue: ProductVariationJson | null) => {
                        setSelectedPaintSupportVariation(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Support Peinture" />}
                />

                <FormLabel>Design</FormLabel>
                <OrderDesignGrid
                    companyDesigns={designs}
                    orderDesign={selectedCompanyDesign}
                    onChangeOrderDesign={setSelectedCompanyDesign}
                />

                <FormLabel>Calque</FormLabel>
                <Autocomplete
                    options={calqueVariations}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={selectedCalqueVariation}
                    onChange={(event: React.SyntheticEvent, newValue: ProductVariationJson | null) => {
                        setSelectedCalqueVariation(newValue)
                        setCalqueQuantity(0)
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Calque" />}
                />
                {selectedCalqueVariation ? (
                    <>
                        <FormLabel>Quantite Calque</FormLabel>
                        <NumberField
                            value={calqueQuantity}
                            onChange={setCalqueQuantity}
                            error={ calqueQuantity > (selectedCalqueVariation.quantity)}
                        />
                        <Typography
                            variant="body2"
                            sx={{ display: "flex", mt: -2 }}
                            color={calqueQuantity > (selectedCalqueVariation.quantity) ? 'error' : ''}
                        >Quantite {selectedCalqueVariation.name} Actuelle: {selectedCalqueVariation.quantity}</Typography>
                    </>
                ) : ('')}

                <FormLabel>Quantite</FormLabel>
                <NumberField
                    value={quantity}
                    onChange={handleQuantityChange}
                    error={ quantity > (selectedVariant?.quantity ?? 0)}
                />
                {selectedVariant ? (
                    <Typography
                        variant="body2"
                        sx={{ display: "flex", mt: -2 }}
                        color={ quantity > (selectedVariant?.quantity ?? 0) ? 'error' : ''}
                    >Quantite {selectedVariant.name} Actuelle: {selectedVariant?.quantity}</Typography>
                ) : ('')}

                <FormLabel>Prix Unitaire</FormLabel>
                <NumberField value={unitPrice} onChange={handleUnitPriceChange}/>

                <FormLabel>Prix Totale</FormLabel>
                <NumberField value={totalPrice} onChange={handleTotalPriceChange}/>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddOrderLine()}
                >Ajouter Ligne Commande
                </Button>
                <Button variant="outlined" onClick={() => handleCloseDialog()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SellOrderLineDialog
