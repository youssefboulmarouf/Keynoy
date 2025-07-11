import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Switch, TextField} from "@mui/material";
import {
    CompanyJson,
    CompanyTypeEnum,
    ModalTypeEnum,
    OrderJson,
    OrderStatusEnum,
    ShippingJson
} from "../../../model/KeynoyModels";
import React, {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import FormLabel from "../../common/FormLabel";
import {DatePicker} from "@mui/x-date-pickers";
import {useShippingContext} from "../../../context/ShippingContext";
import Button from "@mui/material/Button";

interface ShipOrderDialogProps {
    concernedOrder: OrderJson;
    customers: CompanyJson[];
    shippers: CompanyJson[];
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
}

const ShipOrderDialog: React.FC<ShipOrderDialogProps> = ({
    concernedOrder,
    dialogType,
    customers,
    shippers,
    openDialog,
    closeDialog
}) => {
    const [customer, setCustomer] = useState<CompanyJson | null>(null);
    const [shippingDetails, setShippingDetails] = useState<ShippingJson | null>(null)
    const [isShipped, setIsShipped] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);
    const [shippingDate, setShippingDate] = useState<Date | null>(null);
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [shippingPrice, setShippingPrice] = useState<number>(0);
    const [selectedShipper, setSelectedShipper] = useState<CompanyJson | null>(null);

    const { shippings, addShipping, editShipping } = useShippingContext();

    useEffect(() => {
        setShippingDetails(shippings.find(s => s.orderId === concernedOrder.id) ?? null)
        setCustomer(customers.find(c => c.id === concernedOrder.companyId) ?? null)
        setIsShipped(concernedOrder.orderStatus >= OrderStatusEnum.SHIPPED)
        setIsDelivered(concernedOrder.orderStatus >= OrderStatusEnum.DELIVERED)
    }, [concernedOrder])

    useEffect(() => {
        setSelectedShipper(shippers.find(c => c.id === shippingDetails?.companyId) ?? null)
        setShippingDate(shippingDetails ? new Date(shippingDetails.shippingDate) : null)
        setDeliveryDate((shippingDetails && shippingDetails.deliveryDate) ? new Date(shippingDetails.deliveryDate) : null)
        setShippingPrice(shippingDetails?.price ?? 0)
    }, [shippingDetails]);

    const handleCloseDialog = () => {
        setShippingDetails(null)
        setCustomer(null)
        setSelectedShipper(null)

        setIsShipped(false)
        setShippingDate(null)
        setIsDelivered(false)
        setDeliveryDate(null)
        setShippingPrice(0)

        closeDialog();
    }

    const handleDialogAction = async () => {
        console.log("handleDialogAction")
        if (concernedOrder.orderStatus < OrderStatusEnum.SHIPPED) {
            console.log("if")
            if (selectedShipper && shippingDate) {
                console.log("add")
                await addShipping({
                    orderId: concernedOrder.id,
                    companyId: selectedShipper.id,
                    shippingDate: shippingDate,
                    deliveryDate: deliveryDate,
                    price: shippingPrice
                })
            }
        } else {
            console.log("else")
            if (shippingDetails && deliveryDate) {
                console.log("edit")
                await editShipping({
                    orderId: shippingDetails.orderId,
                    companyId: shippingDetails.companyId,
                    shippingDate: shippingDetails.shippingDate,
                    deliveryDate: deliveryDate,
                    price: shippingPrice
                })
            }
        }

        handleCloseDialog()
    }

    return (
        <Dialog open={openDialog} onClose={() => handleCloseDialog()} PaperProps={{sx: {width: '700px', maxWidth: '700px'}}}>
            <DialogTitle sx={{ mt: 2 }}>Livraison</DialogTitle>

            <DialogContent>
                <FormLabel>{CompanyTypeEnum.CUSTOMERS}</FormLabel>
                <TextField
                    fullWidth
                    value={customer?.name + " - " + customer?.phone}
                    disabled={true}
                />

                <FormLabel>{CompanyTypeEnum.SHIPPERS}</FormLabel>
                <Autocomplete
                    options={shippers}
                    fullWidth
                    getOptionKey={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={selectedShipper}
                    onChange={(event: React.SyntheticEvent, newValue: CompanyJson | null) =>
                        setSelectedShipper(newValue)
                    }
                    renderInput={(params) => <TextField {...params} placeholder={CompanyTypeEnum.SHIPPERS} />}
                    disabled={concernedOrder.orderStatus >= OrderStatusEnum.SHIPPED}
                />

                <FormLabel>Commande Livrer?</FormLabel>
                <Switch
                    checked={isShipped}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                        setIsShipped(checked)
                    }
                    disabled={concernedOrder.orderStatus >= OrderStatusEnum.SHIPPED}
                />

                {/* TODO : Move date picker to seperated component*/}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormLabel>Date Livraison</FormLabel>
                    <DatePicker
                        label="Date Livraison"
                        value={shippingDate}
                        onChange={(newValue: Date | null) => setShippingDate(newValue)}
                        minDate={new Date("01/01/2024")}
                        maxDate={new Date("01/01/2047")}
                        disabled={concernedOrder.orderStatus >= OrderStatusEnum.SHIPPED && shippingDate != null}
                    />
                </LocalizationProvider>

                <FormLabel>Commande Recu?</FormLabel>
                <Switch
                    checked={isDelivered}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                        setIsDelivered(checked)
                    }
                    disabled={concernedOrder.orderStatus >= OrderStatusEnum.DELIVERED}
                />
                {/* TODO : Move date picker to seperated component*/}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormLabel>Date Reception</FormLabel>
                    <DatePicker
                        label="Date Reception"
                        value={deliveryDate}
                        onChange={(newValue: Date | null) => setDeliveryDate(newValue)}
                        minDate={new Date("01/01/2024")}
                        maxDate={new Date("01/01/2047")}
                        disabled={concernedOrder.orderStatus >= OrderStatusEnum.DELIVERED && deliveryDate != null}
                    />
                </LocalizationProvider>

                <FormLabel>Prix Livraison</FormLabel>
                <TextField
                    fullWidth
                    value={shippingPrice}
                    onChange={(e) => setShippingPrice(Number(e.target.value))}
                    disabled={concernedOrder.orderStatus >= OrderStatusEnum.DELIVERED}
                    sx={{ mb: 2 }}
                />

            </DialogContent>

            <DialogActions>
                {(concernedOrder.orderStatus < OrderStatusEnum.SHIPPED)
                    ? <Button variant="contained" color="primary" onClick={handleDialogAction}>Ajouter Livraison</Button>
                    : <Button variant="contained" color="warning" onClick={handleDialogAction}>Modifier Livraison</Button>
                }
                <Button variant="outlined" onClick={() => handleCloseDialog()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShipOrderDialog;