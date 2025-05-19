import {
    ColorJson,
    ProductJson,
    ProductVariationJson
} from "../../../model/KeynoyModels";
import React, {useState} from "react";
import {
    Autocomplete,
    Table,
    TableBody,
    TableCell, TableHead,
    TableRow, TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface OrderPaintGridProps {
    paintProducts: ProductJson[];
    variations: ProductVariationJson[];
    colors: ColorJson[];
    selectedPaintVariations: ProductVariationJson[];
    setSelectedPaintVariations: (selectedPaintVariations: ProductVariationJson[]) => void;
    disabled?: boolean;
}

const OrderPaintGrid: React.FC<OrderPaintGridProps> = ({
    variations,
    colors,
    paintProducts,
    selectedPaintVariations,
    setSelectedPaintVariations,
    disabled = false
}) => {
    const [paintProduct, setPaintProduct] = useState<ProductJson | null>(null);
    const [paintVariations, setPaintVariations] = useState<ProductVariationJson[]>([]);

    const loadColor = (colorId: number) => {
        return colors.find(c => c.id === colorId);
    }

    return (
        <>
            <Autocomplete
                fullWidth
                getOptionKey={(options) => options.id}
                getOptionLabel={(options) => options.name}
                value={paintProduct}
                renderInput={(params) => <TextField {...params} placeholder="Peinture" />}
                options={paintProducts}
                onChange={(event: React.SyntheticEvent, newValue: ProductJson | null) => {
                    setPaintProduct(newValue)
                    setPaintVariations(
                        variations.filter(v => v.productId === newValue?.id)
                    );
                    setSelectedPaintVariations([]);
                }}
                disabled={disabled}
            />
            {paintProduct ? (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography color="textSecondary" variant="body1">Couleur Disponible</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography color="textSecondary" variant="body1">Couleur Selection</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        {paintVariations.map((paintVariation) => (
                                            <Box
                                                key={paintVariation.id}
                                                onClick={() => {
                                                    const ids = selectedPaintVariations.map(spv => spv.id);
                                                    if (!ids.includes(paintVariation.id)) {
                                                        setSelectedPaintVariations([...selectedPaintVariations, paintVariation])
                                                    }
                                                }}
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '6px',
                                                    backgroundColor: '#' + loadColor(paintVariation.colorId)?.htmlCode,
                                                    border: '1px solid #ccc',
                                                    cursor: 'pointer',
                                                    opacity: 1,
                                                }}
                                                title={loadColor(paintVariation.colorId)?.name}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        {selectedPaintVariations.map((paintVariation) => (
                                            <Box
                                                key={paintVariation.id}
                                                onClick={() => {
                                                    setSelectedPaintVariations(selectedPaintVariations.filter(spv => spv.id != paintVariation.id))
                                                }}
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '6px',
                                                    backgroundColor: '#' + loadColor(paintVariation.colorId)?.htmlCode,
                                                    border: '1px solid #ccc',
                                                    cursor: 'pointer',
                                                    opacity: 1,
                                                }}
                                                title={loadColor(paintVariation.colorId)?.name}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : ('')}

        </>
    );
};

export default OrderPaintGrid;