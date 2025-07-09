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
    designs: CompanyDesignJson[];
    addOrderLine: (orderLine: OrderLineJson) => void;
}

const SellOrderLineDialog: React.FC<SellOrderLineDialogProps> = ({
    openDialog,
    closeDialog,
    productTypes,
    products,
    variations,
    colors,
    designs,
    addOrderLine
}) => {
    const [selectedProductType, setSelectedProductType] = useState<ProductTypeJson | null>(null);
    const [narrowProducts, setNarrowProducts] = useState<ProductJson[]>([]);
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
        const paintProductTypeIds = productTypes
            .filter(pt => pt.isPaint && !pt.isPrintable && !pt.isTool)
            .map(pt => pt.id);
        setPaintProducts(products.filter(p => paintProductTypeIds.includes(p.productTypeId)));

        const paintSupportProductTypeIds = productTypes
            .filter(pt => pt.isPaint && pt.isPrintable && !pt.isTool)
            .map(pt => pt.id);
        const paintSupportProductIds = products.filter(p => paintSupportProductTypeIds.includes(p.productTypeId)).map(p => p.id);
        setPaintSupportVariations(variations.filter(v => paintSupportProductIds.includes(v.productId)))

        const calqueProductIds = products.filter(p => p.isLayer).map(p => p.id);
        setCalqueVariations(variations.filter(v => calqueProductIds.includes(v.productId)));
    }, [productTypes, products]);

    useEffect(() => {
        setNarrowProducts(products.filter(p => p.productTypeId === selectedProductType?.id && p.isSellable));
    }, [selectedProductType]);

    useEffect(() => {
        setNarrowVariation(variations.filter(v => v.productId === selectedProduct?.id));
    }, [selectedProduct]);

    const handleAddOrderLine = () => {
        if (selectedVariant && selectedCompanyDesign && selectedPaintVariations.length > 0) {
            const orderLine: OrderLineJson = {
                id: 0,
                orderId: 0,
                designId: selectedCompanyDesign.id,
                orderLineProductVariations: buildOrderLineProductVariations()
            }

            addOrderLine(orderLine)
            handleCloseDialog();
        }
    }

    const buildOrderLineProductVariations = () => {
        const orderLineProductVariations: OrderLineProductVariationJson[] = [];
        if (selectedVariant && selectedCalqueVariation && selectedPaintVariations.length > 0) {
            orderLineProductVariations.push({
                orderLineId: 0,
                productVariationId: selectedVariant.id,
                quantity: quantity,
                unitPrice: unitPrice
            })

            selectedPaintVariations.forEach(spp => {
                orderLineProductVariations.push({
                    orderLineId: 0,
                    productVariationId: spp?.id,
                    quantity: 0,
                    unitPrice: 0
                })
            })

            orderLineProductVariations.push({
                orderLineId: 0,
                productVariationId: selectedCalqueVariation.id,
                quantity: calqueQuantity,
                unitPrice: 0
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
                <FormLabel>Type Produit</FormLabel>
                <Autocomplete
                    options={productTypes.filter(pt => pt.isPrintable && !pt.isPaint && !pt.isTool)}
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

                <FormLabel>Peinture</FormLabel>
                <OrderPaintGrid
                    paintProducts={paintProducts}
                    variations={variations}
                    colors={colors}
                    selectedPaintVariations={selectedPaintVariations}
                    setSelectedPaintVariations={setSelectedPaintVariations}
                />

                <FormLabel>Support Peinture</FormLabel>
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
                            sx={{ display: "flex"}}
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
                        sx={{ display: "flex"}}
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
