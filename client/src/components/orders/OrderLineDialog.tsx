import {OrderLineJson, ProductJson, ProductTypeJson} from "../../model/KeynoyModels";
import {Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";

interface OrderLineDialog {
    openDialog: boolean;
    closeDialog: () => void;
    productTypes: ProductTypeJson[];
    products: ProductJson[];
    addOrderLine: (orderLine: OrderLineJson) => void;
}

const OrderLineDialog: React.FC<OrderLineDialog> = (
    {
        openDialog,
        closeDialog,
        productTypes,
        products,
        addOrderLine
    }
) => {
    const [productType, setProductType] = useState<ProductTypeJson | null>(null);
    const [narrowProducts, setNarrowProducts] = useState<ProductJson[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductJson | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);

    useEffect(() => {
        setNarrowProducts(products.filter(p => p.productTypeId === productType?.id) || products);
    }, [productType]);

    const handleAddOrderLine = () => {
        addOrderLine({
            orderId: 0,
            productId: selectedProduct?.id || 0,
            quantity: Number(quantity),
            unitPrice: Number(unitPrice),
        });
        handleCloseDialog();
    }

    const handleCloseDialog = () => {
        setProductType(null);
        setSelectedProduct(null);
        setQuantity(0);
        setUnitPrice(0);
        closeDialog();
    }

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '400px', maxWidth: '400px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{"Ajouter Ligne Commande"}</DialogTitle>

            <DialogContent>
                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Type Produit</Typography>
                <Autocomplete
                    options={productTypes}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={productType}
                    onChange={(event: React.SyntheticEvent, newValue: ProductTypeJson | null) =>
                        setProductType(newValue)
                    }
                    renderInput={(params) => <TextField {...params} placeholder="Type Produit" />}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Produit</Typography>
                <Autocomplete
                    options={narrowProducts}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={selectedProduct}
                    onChange={(event: React.SyntheticEvent, newValue: ProductJson | null) =>
                        setSelectedProduct(newValue)
                    }
                    renderInput={(params) => <TextField {...params} placeholder="Produit" />}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {/*<Box*/}
                                {/*    sx={{*/}
                                {/*        width: 25,*/}
                                {/*        height: 25,*/}
                                {/*        backgroundColor: option.color,*/}
                                {/*        border: "1px solid #ccc",*/}
                                {/*        borderRadius: "4px",*/}
                                {/*    }}*/}
                                {/*/>*/}
                                <Typography variant="body2">{option.name}</Typography>
                            </Stack>
                        </li>
                    )}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Quantite</Typography>
                <TextField
                    fullWidth
                    value={quantity}
                    onChange={(e: any) => setQuantity(e.target.value)}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Prix Unitaire</Typography>
                <TextField
                    fullWidth
                    value={unitPrice}
                    onChange={(e: any) => setUnitPrice(e.target.value)}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Prix Totale</Typography>
                <TextField
                    fullWidth
                    value={quantity * unitPrice}
                    disabled
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="primary" onClick={() => handleAddOrderLine()}>Ajouter Ligne Commande</Button>
                <Button variant="outlined" onClick={() => handleCloseDialog()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default OrderLineDialog
