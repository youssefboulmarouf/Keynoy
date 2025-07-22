import React, {useEffect, useState} from "react";
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {OrderJson, OrderLineJson, OrderStatusEnum} from "../../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import {useProductVariationContext} from "../../../context/ProductVariationContext";
import {useColorContext} from "../../../context/ColorsContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useOrdersContext} from "../../../context/OrdersContext";

interface SyncInventoryDialogProps {
    concernedOrder: OrderJson;
    openDialog: boolean;
    closeDialog: () => void;
}

interface SyncInventoryData {
    orderLineId: number;
    productVariationId: number;
    quantity: number; // Initial quantity
    finalQuantity: number; // Editable quantity
}

const SyncInventoryDialog: React.FC<SyncInventoryDialogProps> = ({
    concernedOrder,
    openDialog,
    closeDialog
}) => {
    const {variations} = useProductVariationContext();
    const {colors} = useColorContext();
    const { syncInventory } = useOrdersContext();

    const [syncInventoryData, setSyncInventoryData] = useState<SyncInventoryData[]>([]);

    useEffect(() => {
        const inventoryData: SyncInventoryData[] = [];
        concernedOrder.orderLines.forEach(ol => {
            inventoryData.push({
                orderLineId: ol.id,
                productVariationId: ol.productVariationId,
                quantity: ol.quantity,
                finalQuantity: ol.quantity, // default to initial quantity
            });
            ol.orderLineConsumedVariations.forEach(cv => {
                inventoryData.push({
                    orderLineId: cv.orderLineId,
                    productVariationId: cv.productVariationId,
                    quantity: cv.quantity,
                    finalQuantity: cv.quantity,
                });
            });
        });
        setSyncInventoryData(inventoryData);
    }, [concernedOrder]);

    const handleFinalQuantityChange = (orderLineId: number, productVariationId: number, value: number) => {
        setSyncInventoryData(prev =>
            prev.map(data =>
                data.orderLineId === orderLineId && data.productVariationId === productVariationId
                    ? { ...data, finalQuantity: value }
                    : data
            )
        );
    };

    const getFinalQuantity = (orderLineId: number, productVariationId: number): number => {
        return syncInventoryData.find(
            d => d.orderLineId === orderLineId && d.productVariationId === productVariationId
        )?.finalQuantity ?? 0;
    };

    const buildUpdatedOrderJson = (): OrderJson => {
        return {
            ...concernedOrder,
            orderLines: concernedOrder.orderLines.map(ol => ({
                ...ol,
                quantity: getFinalQuantity(ol.id, ol.productVariationId),
                orderLineConsumedVariations: ol.orderLineConsumedVariations.map(cv => ({
                    ...cv,
                    quantity: getFinalQuantity(cv.orderLineId, cv.productVariationId)
                }))
            }))
        };
    };

    const handleSyncInventory = async () => {
        console.log("syncInventoryData: ", syncInventoryData)
        console.log("buildUpdatedOrderJson: ", buildUpdatedOrderJson())
        await syncInventory(buildUpdatedOrderJson());
        closeDialog();
    }

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{ sx: { width: '900px', maxWidth: '900px' } }}>
            <DialogTitle sx={{ mt: 2 }}>Sync Inventaire</DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="h6" fontSize="14px">Id Ligne Commande</Typography></TableCell>
                            <TableCell><Typography variant="h6" fontSize="14px">Variation</Typography></TableCell>
                            <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                            <TableCell><Typography variant="h6" fontSize="14px">Quantite Initiale</Typography></TableCell>
                            <TableCell><Typography variant="h6" fontSize="14px">Quantite Finale</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {syncInventoryData.map(data => (
                            <TableRow key={data.orderLineId + '-' + data.productVariationId}>
                                <TableCell>{data.orderLineId}</TableCell>
                                <TableCell>{variations.find(v => v.id === data.productVariationId)?.name}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: '6px',
                                            backgroundColor: '#' + colors.find(c => c.id === variations.find(v => v.id === data.productVariationId)?.colorId)?.htmlCode,
                                            border: "1px solid #ccc",
                                            cursor: 'pointer',
                                            opacity: 1,
                                        }}
                                        title={colors.find(c => c.id === variations.find(v => v.id === data.productVariationId)?.colorId)?.name}
                                    />
                                </TableCell>
                                <TableCell>{data.quantity}</TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        value={data.finalQuantity}
                                        onChange={(e) =>
                                            handleFinalQuantityChange(
                                                data.orderLineId,
                                                data.productVariationId,
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSyncInventory}>Ajouter Livraison</Button>
                <Button variant="outlined" onClick={() => closeDialog()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SyncInventoryDialog;