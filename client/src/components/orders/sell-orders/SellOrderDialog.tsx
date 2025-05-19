import {
    CompanyJson,
    CompanyTypeEnum,
    ModalTypeEnum,
    OrderJson,
    OrderLineJson,
    OrderStatusEnum,
    OrderTypeEnum
} from "../../../model/KeynoyModels";
import {
    Autocomplete,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import TableCallToActionButton from "../../common/TableCallToActionButton";
import {
    mapOrderStatusToString,
    mapStringToOrderStatus,
    ORDER_STATUS_STRING_OPTIONS
} from "../order-components/OrderStatusUtils";
import SellOrderLineDialog from "./order-line/SellOrderLineDialog";
import FormLabel from "../../common/FormLabel";
import {useCompaniesContext} from "../../../context/CompaniesContext";
import {useDialogController} from "../../common/useDialogController";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import {useColorContext} from "../../../context/ColorsContext";
import {useProductTypesContext} from "../../../context/ProductTypesContext";
import {useProductsContext} from "../../../context/ProductsContext";
import {useProductVariationContext} from "../../../context/ProductVariationContext";
import {useCompaniesDesignsContext} from "../../../context/CompaniesDesignsContext";
import Button from "@mui/material/Button";
import {getActionButton} from "../../common/Utilities";

interface OrderDialogProps {
    concernedOrder: OrderJson;
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
    addOrder: (order: OrderJson) => void;
    editOrder: (order: OrderJson) => void;
    removeOrder: (order: OrderJson) => void;
    syncInventory: (order: OrderJson) => void;
}

const emptyOrderLine: OrderLineJson = {
    id: 0,
    orderId: 0,
    designId: 0,
    orderLineProductVariations: []
}

const SellOrderDialog: React.FC<OrderDialogProps> = ({
    concernedOrder,
    dialogType,
    openDialog,
    closeDialog,
    addOrder,
    editOrder,
    removeOrder,
    syncInventory,
}) => {
    const [customers, setCustomers] = useState<CompanyJson[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<CompanyJson | null>(null);
    const [orderLines, setOrderLines] = useState<OrderLineJson[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [orderDate, setOrderDate] = useState<Date | null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatusEnum | null>(null);

    const {companies} = useCompaniesContext();
    const {colors} = useColorContext();
    const {productTypes} = useProductTypesContext();
    const {products} = useProductsContext();
    const {variations} = useProductVariationContext();
    const {designs} = useCompaniesDesignsContext();

    const orderLineDialog = useDialogController<OrderLineJson>(emptyOrderLine);

    useEffect(() => {
        setCustomers(companies.filter((company) => company.companyType === CompanyTypeEnum.CUSTOMERS));
    }, [companies]);

    useEffect(() => {
        setOrderLines(concernedOrder.orderLines);
        setOrderDate(new Date(concernedOrder.date))
        setTotalPrice(concernedOrder.totalPrice)
        setOrderStatus(concernedOrder.orderStatus)
        setSelectedCompany(companies.find((company) => company.id === concernedOrder.companyId) ?? null)
    });

    useEffect(() => {
        setTotalPrice(
            orderLines
                .flatMap(ol => ol.orderLineProductVariations)
                .reduce((pv, cv) => pv + cv.unitPrice * cv.quantity, 0)
        )
    }, [orderLines]);

    const deducePrintable = (orderLine: OrderLineJson) => {
        const printableProductTypeIds = productTypes
            .filter(pt => pt.isPrintable && !pt.isPaint && !pt.isTool)
            .map(pt => pt.id);
        const printableSellableProductIds = products
            .filter(p => printableProductTypeIds.includes(p.productTypeId) && p.isSellable)
            .map(p => p.id);

        const printableSellableVariationIds = variations
            .filter(v => printableSellableProductIds.includes(v.productId))
            .map(v => v.id);
        return orderLine.orderLineProductVariations.find(olpv => printableSellableVariationIds.includes(olpv.productVariationId))
    }

    const deduceColor = (paintVariationColorId: number) => {
        return colors.find(c => c.id === paintVariationColorId);
    }

    const deducePaints = (orderLine: OrderLineJson) => {
        const paintProductTypeIds = productTypes
            .filter(pt => pt.isPaint && !pt.isPrintable && !pt.isTool)
            .map(pt => pt.id);

        const paintProductIds = products
            .filter(p => paintProductTypeIds.includes(p.productTypeId))
            .map(p => p.id);

        const paintVariationIds = variations
            .filter(v => paintProductIds.includes(v.productId))
            .map(v => v.id);

        const productVariationIds = orderLine
            .orderLineProductVariations
            .filter(olpv => paintVariationIds.includes(olpv.productVariationId))
            .map(olpv => olpv.productVariationId);

        return variations.filter(v => productVariationIds.includes(v.id));
    }

    const deducePaintProductName = (orderLine: OrderLineJson) => {
        return products.find(p => p.id === deducePaints(orderLine)[0].productId)
    }

    const deduceCalque = (orderLine: OrderLineJson) => {
        const calqueProductIds = products
            .filter(p => p.isLayer)
            .map(p => p.id);

        const calqueVariationIds = variations
            .filter(v => calqueProductIds.includes(v.productId))
            .map(v => v.id);

        return orderLine.orderLineProductVariations.find(olpv => calqueVariationIds.includes(olpv.productVariationId))
    }

    const deduceCalqueProductName = (orderLine: OrderLineJson) => {
        return variations.find(v => deduceCalque(orderLine)?.productVariationId === v.id);
    }

    const handleAddOrderLine = (newOrderLine: OrderLineJson) => {
        console.log("newOrderLine: ", newOrderLine)
        setOrderLines([...orderLines, newOrderLine]);
    };

    const handleRemoveOrderLine = (orderLine: OrderLineJson) => {
        setOrderLines((prev) => prev.filter((line) => line !== orderLine));
    };

    const handleCloseDialog = () => {
        setSelectedCompany(null);
        setOrderLines([]);
        setTotalPrice(0);
        setOrderDate(new Date());
        setOrderStatus(OrderStatusEnum.CONFIRMED);
        closeDialog();
    }

    const handleSubmit = () => {
        if (orderStatus && orderStatus < concernedOrder.orderStatus) return;
        if (orderLines.length === 0) return;
        if (!selectedCompany) return;
        if (!orderStatus) return;
        if (!orderDate) return;

        if (dialogType === ModalTypeEnum.ADD) {
            addOrder({
                id: 0,
                companyId: selectedCompany.id,
                orderType: OrderTypeEnum.SELL,
                orderStatus: orderStatus,
                totalPrice: totalPrice,
                date: orderDate,
                inventoryUpdated: false,
                expenseUpdated: false,
                orderLines: orderLines
            });
        } else if (dialogType === ModalTypeEnum.UPDATE) {
            editOrder({
                id: concernedOrder.id,
                companyId: selectedCompany.id,
                orderType: OrderTypeEnum.SELL,
                orderStatus: orderStatus,
                totalPrice: totalPrice,
                date: orderDate,
                inventoryUpdated: false,
                expenseUpdated: false,
                orderLines: orderLines
            });
        } else {
            removeOrder(concernedOrder);
        }

        handleCloseDialog();
    }

    const handleSyncInventory = () => {
        syncInventory(concernedOrder);
        handleCloseDialog();
    }

    const actionText = `${dialogType} Commande ${OrderTypeEnum.SELL}`;
    const actionButton = getActionButton(dialogType, handleSubmit, actionText);

    return (
        <>
            <Dialog open={openDialog} onClose={() => handleCloseDialog()} PaperProps={{sx: {width: '1000px', maxWidth: '1000px'}}}>
                <DialogTitle sx={{ mt: 2 }}>{actionText}</DialogTitle>
                <DialogContent>
                    <FormLabel>Id</FormLabel>
                    <TextField fullWidth value={concernedOrder.id === 0 ? "" : concernedOrder.id} disabled/>

                    <FormLabel>{CompanyTypeEnum.CUSTOMERS}</FormLabel>
                    <Autocomplete
                        options={customers}
                        fullWidth
                        getOptionKey={(options) => options.id}
                        getOptionLabel={(options) => options.name}
                        value={selectedCompany}
                        onChange={(event: React.SyntheticEvent, newValue: CompanyJson | null) =>
                            setSelectedCompany(newValue)
                        }
                        renderInput={(params) => <TextField {...params} placeholder={CompanyTypeEnum.CUSTOMERS} />}
                        disabled={dialogType === ModalTypeEnum.DELETE || concernedOrder.orderStatus > OrderStatusEnum.CONFIRMED}
                    />

                    {(dialogType != ModalTypeEnum.ADD) ? (
                        <>
                            <FormLabel>Statue</FormLabel>
                            <Autocomplete
                                options={ORDER_STATUS_STRING_OPTIONS}
                                value={mapOrderStatusToString(orderStatus)}
                                onChange={(e, newValue) =>
                                    setOrderStatus(mapStringToOrderStatus(newValue))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Status"
                                        error={!!(orderStatus && orderStatus < concernedOrder.orderStatus)}
                                        helperText={
                                            orderStatus && orderStatus < concernedOrder.orderStatus
                                                ? `Le nouveau statut "${mapOrderStatusToString(orderStatus)}" est inférieur au statut actuel "${mapOrderStatusToString(concernedOrder.orderStatus)}"`
                                                : ''
                                        }
                                    />
                                )}
                                sx={{ minWidth: 180 }}
                                size="small"
                                disabled={dialogType === ModalTypeEnum.DELETE}
                            />
                        </>
                    ) : ('')}

                    {/* TODO : Move date picker to seperated component*/}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormLabel>Date Commande</FormLabel>
                        <DatePicker
                            label="Start Date"
                            value={orderDate}
                            onChange={(newValue: Date | null) => setOrderDate(newValue)}
                            minDate={new Date("01/01/2024")}
                            maxDate={new Date("01/01/2047")}
                            disabled={dialogType === ModalTypeEnum.DELETE || concernedOrder.orderStatus > OrderStatusEnum.CONFIRMED}
                        />
                    </LocalizationProvider>

                    <FormLabel>Prix Total</FormLabel>
                    <TextField fullWidth value={totalPrice} disabled sx={{ mb: 2 }}/>

                    {(selectedCompany) ? (
                        <>
                            <TableCallToActionButton
                                fullwidth={true}
                                callToActionText="Ajouter Ligne Commande"
                                callToActionFunction={() => orderLineDialog.openDialog(ModalTypeEnum.ADD, emptyOrderLine)}
                                disabled={dialogType === ModalTypeEnum.DELETE || concernedOrder.orderStatus > OrderStatusEnum.CONFIRMED}
                            />

                            {orderLines.length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell><Typography variant="h6" fontSize="14px">Produit</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Peinture</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Calque</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Quantite Calque</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Quantite</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Prix Unitaire</Typography></TableCell>
                                            <TableCell><Typography variant="h6" fontSize="14px">Total</Typography></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderLines
                                            .map((ol) => (
                                                <TableRow key={deducePrintable(ol)?.productVariationId}>
                                                    <TableCell>
                                                        <Tooltip title="Supprimer Ligne">
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveOrderLine(ol)}
                                                                disabled={dialogType === ModalTypeEnum.DELETE || concernedOrder.orderStatus > OrderStatusEnum.CONFIRMED}
                                                            >
                                                                <ClearIcon width={22} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>{variations.find(v => v.id === deducePrintable(ol)?.productVariationId)?.name}</TableCell>
                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                width: 30,
                                                                height: 30,
                                                                borderRadius: '6px',
                                                                backgroundColor: '#' + colors.find(c => c.id === variations.find(v => v.id === deducePrintable(ol)?.productVariationId)?.colorId)?.htmlCode,
                                                                border: "1px solid #ccc",
                                                                cursor: 'pointer',
                                                                opacity: 1,
                                                            }}
                                                            title={colors.find(c => c.id === variations.find(v => v.id === deducePrintable(ol)?.productVariationId)?.colorId)?.name}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {deducePaintProductName(ol)?.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {deducePaints(ol).map(vp => (
                                                                <Box
                                                                    key={vp.id}
                                                                    sx={{
                                                                        width: 30,
                                                                        height: 30,
                                                                        borderRadius: '6px',
                                                                        backgroundColor: '#' + deduceColor(vp.colorId)?.htmlCode,
                                                                        border: '1px solid #ccc',
                                                                        cursor: 'pointer',
                                                                        opacity: 1,
                                                                    }}
                                                                    title={vp.name}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {deduceCalqueProductName(ol)?.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {deduceCalque(ol)?.quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {deducePrintable(ol)?.quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {deducePrintable(ol)?.unitPrice}
                                                    </TableCell>
                                                    <TableCell>
                                                        {(deducePrintable(ol)?.quantity ?? 0) * (deducePrintable(ol)?.unitPrice ?? 0)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            ) : ('')}
                        </>
                    ) : ('')}
                </DialogContent>
                <DialogActions>
                    {actionButton}
                    {(dialogType === ModalTypeEnum.UPDATE && concernedOrder.orderStatus > OrderStatusEnum.CONFIRMED) ? (
                        <Button
                            variant="contained"
                            onClick={() => handleSyncInventory()}
                            color="info"
                            disabled={concernedOrder.inventoryUpdated}
                        >Sync Inventaire</Button>
                    ) : ('')}
                    <Button variant="outlined" onClick={() => handleCloseDialog()}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {selectedCompany ? (
                <SellOrderLineDialog
                    openDialog={orderLineDialog.open}
                    closeDialog={orderLineDialog.closeDialog}
                    productTypes={productTypes}
                    products={products}
                    variations={variations}
                    colors={colors}
                    designs={designs.filter(d => d.companyId === selectedCompany.id)}
                    addOrderLine={handleAddOrderLine}/>
            ) : ('')}
        </>

    );
}

export default SellOrderDialog;