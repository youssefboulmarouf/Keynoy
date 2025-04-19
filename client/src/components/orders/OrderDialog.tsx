import {
    CompanyJson,
    CompanyTypeEnum,
    ModalTypeEnum,
    OrderJson,
    OrderLineJson,
    OrderStatusEnum,
    OrderTypeEnum,
    ProductJson,
    ProductTypeJson
} from "../../model/KeynoyModels";
import {
    Autocomplete, Box,
    Dialog,
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
import Typography from "@mui/material/Typography";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import TableCallToActionButton from "../common/TableCallToActionButton";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import {mapOrderStatusToString, mapStringToOrderStatus, ORDER_STATUS_STRING_OPTIONS} from "./OrderStatusUtils";
import OrderLineDialog from "./OrderLineDialog";

interface OrderDialogProps {
    concernedOrder: OrderJson;
    type: string;
    companies: CompanyJson[];
    products: ProductJson[];
    productsType: ProductTypeJson[];
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
    concernedOrder,
    type,
    companies,
    products,
    productsType,
    dialogType,
    openDialog,
    closeDialog
}) => {
    const [customers, setCustomers] = useState<CompanyJson[]>([]);
    const [suppliers, setSuppliers] = useState<CompanyJson[]>([]);
    const [shippers, setShippers] = useState<CompanyJson[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState<CompanyJson | null>(null);
    const [selectedSupplier, setSelectedSupplier] = useState<CompanyJson | null>(null);
    const [orderLines, setOrderLines] = useState<OrderLineJson[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [orderDate, setOrderDate] = useState<Date | null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatusEnum | null>(null);

    const [openOrderLineDialog, setOpenOrderLineDialog] = useState<boolean>(false);

    let actionText = `${dialogType} Commande ${type}`;

    useEffect(() => {
        setCustomers(companies.filter((company) => company.type === CompanyTypeEnum.CUSTOMERS));
        setSuppliers(companies.filter((company) => company.type === CompanyTypeEnum.SUPPLIERS));
        setShippers(companies.filter((company) => company.type === CompanyTypeEnum.SHIPPERS));
    }, [companies]);

    useEffect(() => {
        setSelectedCustomer(
            companies
                .find((company) =>
                    company.type === CompanyTypeEnum.CUSTOMERS
                    && company.id === concernedOrder.customerId
                )
            || null
        )

        setSelectedSupplier(
            companies
                .find((company) =>
                    company.type === CompanyTypeEnum.SUPPLIERS
                    && company.id === concernedOrder.supplierId
                )
            || null
        )
        setOrderLines(concernedOrder.orderLines);
        setOrderDate(new Date(concernedOrder.date))
        setTotalPrice(concernedOrder.totalPrice)
        if (dialogType === ModalTypeEnum.DELETE || dialogType === ModalTypeEnum.UPDATE) {
            setOrderStatus(concernedOrder.orderStatus)
        } else {
            setOrderStatus(OrderStatusEnum.CONFIRMED)
        }
    }, [concernedOrder]);

    const handleAddOrderLine = (newOrderLine: OrderLineJson) => {
        setOrderLines((prev) => {
            const existingOrderLine = prev.find(
                (line) => line.productId === newOrderLine.productId
            );

            if (existingOrderLine) {
                return prev.map((line) =>
                    line.productId === newOrderLine.productId
                        ? {...line, quantity: line.quantity + newOrderLine.quantity}
                        : line
                );
            } else {
                return [...prev, newOrderLine];
            }
        });
    };

    const handleRemoveOrderLine = (productId: number) => {
        setOrderLines((prev) => prev.filter((line) => line.productId !== productId));
    };

    return (
        <>
            <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '700px', maxWidth: '700px'}}}>
                <DialogTitle sx={{ mt: 2 }}>{actionText}</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Id</Typography>
                    <TextField fullWidth value={concernedOrder.id === 0 ? "" : concernedOrder.id} disabled/>

                    {type === OrderTypeEnum.BUY ? (
                        <>
                            <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Fournisseur</Typography>
                            <Autocomplete
                                options={suppliers}
                                fullWidth
                                getOptionKey={(options) => options.id}
                                getOptionLabel={(options) => options.name}
                                value={selectedSupplier}
                                onChange={(event: React.SyntheticEvent, newValue: CompanyJson | null) =>
                                    setSelectedSupplier(newValue)
                                }
                                renderInput={(params) => <TextField {...params} placeholder={CompanyTypeEnum.SUPPLIERS} />}
                                disabled={dialogType === ModalTypeEnum.DELETE || dialogType === ModalTypeEnum.UPDATE}
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Client</Typography>
                            <Autocomplete
                                options={customers}
                                fullWidth
                                getOptionKey={(options) => options.id}
                                getOptionLabel={(options) => options.name}
                                value={selectedCustomer}
                                onChange={(event: React.SyntheticEvent, newValue: CompanyJson | null) =>
                                    setSelectedCustomer(newValue)
                                }
                                renderInput={(params) => <TextField {...params} placeholder={CompanyTypeEnum.CUSTOMERS} />}
                                disabled={dialogType === ModalTypeEnum.DELETE || dialogType === ModalTypeEnum.UPDATE}
                                size="small"
                            />
                        </>
                    )}

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Statue</Typography>
                    <Autocomplete
                        options={ORDER_STATUS_STRING_OPTIONS}
                        value={mapOrderStatusToString(orderStatus)}
                        onChange={(e, newValue) =>
                            setOrderStatus(mapStringToOrderStatus(newValue))
                        }
                        renderInput={(params) => <TextField {...params} label="Status" />}
                        sx={{ minWidth: 180 }}
                        size="small"
                        disabled={dialogType === ModalTypeEnum.DELETE || dialogType === ModalTypeEnum.ADD}
                    />

                    {/* TODO : Move date picker to seperated component*/}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Date Commande</Typography>
                        <DatePicker
                            label="Start Date"
                            value={orderDate}
                            onChange={(newValue: Date | null) => setOrderDate(newValue)}
                            minDate={new Date("01/01/2024")}
                            maxDate={new Date("01/01/2047")}
                            disabled={dialogType === ModalTypeEnum.DELETE || dialogType === ModalTypeEnum.UPDATE}
                        />
                    </LocalizationProvider>

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Prix Total</Typography>
                    <TextField fullWidth value={totalPrice} disabled sx={{ mb: 2 }}/>

                    {dialogType === ModalTypeEnum.ADD ? (
                        <TableCallToActionButton
                            fullwidth={true}
                            callToActionText="Ajouter Ligne Commande"
                            callToActionFunction={() => {setOpenOrderLineDialog(true)}}
                        />
                    ) : ('')}

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell><Typography variant="h6" fontSize="14px">Nom</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Type</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Quantite</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Prix Unitaire</Typography></TableCell>
                                <TableCell><Typography variant="h6" fontSize="14px">Total</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderLines.map((ol) => (
                                <TableRow key={ol.orderId + ol.productId}>
                                    <TableCell>
                                        <Tooltip title="Supprimer Ligne">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveOrderLine(ol.productId)}
                                                disabled={dialogType === ModalTypeEnum.DELETE || dialogType === ModalTypeEnum.UPDATE}
                                            >
                                                <ClearIcon width={22} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{products.find(p => p.id === ol.productId)?.name}</TableCell>
                                    <TableCell>{productsType.find(pt => pt.id === products.find(p => p.id === ol.productId)?.productTypeId)?.name}</TableCell>
                                    <TableCell>
                                        {/*<Box*/}
                                        {/*    sx={{*/}
                                        {/*        width: 25,*/}
                                        {/*        height: 25,*/}
                                        {/*        backgroundColor: products.find(p => p.id === ol.productId)?.color,*/}
                                        {/*        border: "1px solid #ccc",*/}
                                        {/*        borderRadius: "4px",*/}
                                        {/*    }}*/}
                                        {/*/>*/}
                                    </TableCell>
                                    <TableCell>{ol.quantity}</TableCell>
                                    <TableCell>{ol.unitPrice}</TableCell>
                                    <TableCell>{ol.quantity * ol.unitPrice}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
            <OrderLineDialog
                openDialog={openOrderLineDialog}
                closeDialog={() => setOpenOrderLineDialog(false)}
                productTypes={productsType}
                products={products}
                addOrderLine={handleAddOrderLine}/>
        </>

    );
}

export default OrderDialog;