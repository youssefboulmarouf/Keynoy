import React, {useMemo, useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid, Stack} from "@mui/material";
import {ExpenseJson, ModalTypeEnum} from "../../model/KeynoyModels";
import TableCallToActionButton from "../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import ExpenseList from "./ExpenseList";
import {useDialogController} from "../common/useDialogController";
import {useExpensesContext} from "../../context/ExpensesContext";
import ExpenseDialog from "./ExpenseDialog";
import ExpenseFilter from "./ExpenseFilter";
import {getFirstDayOfCurrentMonth} from "../common/Utilities";

interface FilterProps {
    searchTerm: string;
    order: boolean;
    shipping: boolean;
    startDate: Date | null;
    endDate: Date | null;
}

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Charges",
    },
];

const emptyExpense: ExpenseJson = {
    id: 0,
    date: new Date(),
    name: "",
    orderId: 0,
    totalPrice: 0,
    isOrder: false,
    isShipping: false
};

const Expenses: React.FC = () => {
    const [filters, setFilters] = useState<FilterProps>({
        searchTerm: "",
        order: false,
        shipping: false,
        startDate: getFirstDayOfCurrentMonth(),
        endDate: null
    });

    const expenseDialog = useDialogController<ExpenseJson>(emptyExpense);
    const {expenses, loading, addExpense, editExpense, removeExpense} = useExpensesContext();

    const filteredExpenses = useMemo(() => {
        return expenses.filter(exp => {
            const searchTerm = filters.searchTerm.toLowerCase();
            const expName = exp.name.toLowerCase();
            const expDate = new Date(exp.date);

            const expNameMatchSearch = searchTerm ? expName.includes(searchTerm.toLowerCase()) : true;
            const isOrderExpense = filters.order ? exp.isOrder : true;
            const isShippingExpense = filters.shipping ? exp.isShipping : true;
            const matchesStartDate = filters.startDate ? expDate >= filters.startDate : true;
            const matchesEndDate = filters.endDate ? expDate <= filters.endDate : true;

            return expNameMatchSearch && isOrderExpense && isShippingExpense && matchesStartDate && matchesEndDate;
        }) || [];
    }, [filters, expenses])

    return (
        <>
            <Breadcrumb title="Charges" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <ExpenseFilter filters={filters} setFilters={setFilters} />
                            <TableCallToActionButton
                                fullwidth={false}
                                callToActionText="Ajouter Charges"
                                callToActionFunction={() => expenseDialog.openDialog(ModalTypeEnum.ADD, emptyExpense)}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <ExpenseList loading={loading} expenses={filteredExpenses} handleOpenDialogType={expenseDialog.openDialog}/>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <ExpenseDialog
                selectedExpense={expenseDialog.data}
                dialogType={expenseDialog.type}
                openDialog={expenseDialog.open}
                closeDialog={expenseDialog.closeDialog}
                addExpense={addExpense}
                editExpense={editExpense}
                removeExpense={removeExpense}
            />
        </>
    );
};

export default Expenses;
