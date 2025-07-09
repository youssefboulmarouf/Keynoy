import {ExpenseJson, ModalTypeEnum, OrderStatusEnum} from "../../model/KeynoyModels";
import React, {FC, useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {getActionButton} from "../common/Utilities";
import FormLabel from "../common/FormLabel";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import {stubFalse} from "lodash";
import NumberField from "../common/NumberField";

interface ExpenseDialogProps {
    selectedExpense: ExpenseJson;
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
    addExpense: (expense: ExpenseJson) => void;
    editExpense: (expense: ExpenseJson) => void;
    removeExpense: (expense: ExpenseJson) => void;
}

const ExpenseDialog: FC<ExpenseDialogProps> = ({
    selectedExpense,
    dialogType,
    openDialog,
    closeDialog,
    addExpense,
    editExpense,
    removeExpense
}) => {
    const [expenseName, setExpenseName] = useState<string>("");
    const [expenseCost, setExpenseCost] = useState<number>(0);
    const [expenseDate, setExpenseDate] = useState<Date | null>(null);

    useEffect(() => {
        setExpenseName(selectedExpense.name);
        setExpenseCost(selectedExpense.totalPrice);
        setExpenseDate(new Date(selectedExpense.date));
    }, [selectedExpense]);

    const handleSubmit = async () => {
        if (!expenseName) return;
        if (!expenseCost) return;
        if (!expenseDate) return;

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeExpense(selectedExpense);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addExpense({
                id: 0,
                name: expenseName,
                totalPrice: expenseCost,
                date: expenseDate,
                orderId: 0,
                isShipping: false,
                isOrder: false

            });
        } else {
            await editExpense({
                id: selectedExpense.id,
                name: expenseName,
                totalPrice: expenseCost,
                date: expenseDate,
                orderId: 0,
                isShipping: false,
                isOrder: false
            });
        }

        emptyForm();
    }

    const emptyForm = () => {
        setExpenseName("");
        setExpenseCost(0);
        setExpenseDate(null);

        closeDialog();
    }

    const actionButton = getActionButton(
        dialogType,
        handleSubmit,
        `${dialogType} Charge`,
        false
    );

    return (
        <Dialog open={openDialog} onClose={() => {}} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{dialogType} Expense</DialogTitle>

            <DialogContent>
                <FormLabel>Id</FormLabel>
                <TextField fullWidth value={selectedExpense.id === 0 ? "" : selectedExpense.id} disabled />

                <FormLabel>Nom Charge</FormLabel>
                <TextField
                    fullWidth
                    value={expenseName}
                    onChange={(e: any) => setExpenseName(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                />

                <FormLabel>Cout</FormLabel>
                <NumberField
                    value={expenseCost}
                    onChange={setExpenseCost}
                    disabled={dialogType === ModalTypeEnum.DELETE}
                />

                {/* TODO : Move date picker to seperated component*/}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormLabel>Date Livraison</FormLabel>
                    <DatePicker
                        label="Date Charge"
                        value={expenseDate}
                        onChange={(newValue: Date | null) => setExpenseDate(newValue)}
                        minDate={new Date("01/01/2024")}
                        maxDate={new Date("01/01/2047")}
                        disabled={dialogType === ModalTypeEnum.DELETE}
                    />
                </LocalizationProvider>

                {(selectedExpense.isOrder || selectedExpense.isShipping)
                    ? selectedExpense.orderId
                    : ''
                }

            </DialogContent>

            <DialogActions>
                {actionButton}
                <Button variant="outlined" onClick={() => emptyForm()}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExpenseDialog;