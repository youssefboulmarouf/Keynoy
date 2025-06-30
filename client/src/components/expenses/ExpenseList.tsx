import {ExpenseJson, ModalTypeEnum} from "../../model/KeynoyModels";
import LoadingComponent from "../common/LoadingComponent";
import React from "react";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {formatDate} from "../common/Utilities";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";
import {usePaginationController} from "../common/usePaginationController";
import Pagination from "../common/Pagination";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

interface ExpenseListProps {
    loading: boolean;
    expenses: ExpenseJson[];
    handleOpenDialogType: (type: ModalTypeEnum, expense: ExpenseJson) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({expenses, loading, handleOpenDialogType}) => {
    const paginationController = usePaginationController<ExpenseJson>(expenses);

    if (loading) return <LoadingComponent message="Loading Expenses" />;
    if (expenses.length === 0) return <Typography>Aucun charge trouver</Typography>;

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Charge</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Achat</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Livraison</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Id Commande</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Date</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Prix Total</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {expenses.map((exp, i) => (
                    <TableRow key={exp.id}>
                        <TableCell>{exp.id}</TableCell>
                        <TableCell>{exp.name}</TableCell>
                        <TableCell>
                            {exp.isOrder ? (
                                <CheckIcon color="success" width={22} />
                            ) : (
                                <ClearIcon color="error" width={22} />
                            )}
                        </TableCell>
                        <TableCell>
                            {exp.isShipping ? (
                                <CheckIcon color="success" width={22} />
                            ) : (
                                <ClearIcon color="error" width={22} />
                            )}
                        </TableCell>
                        <TableCell>{exp.orderId ? exp.orderId : '-'}</TableCell>
                        <TableCell>{formatDate(exp.date)}</TableCell>
                        <TableCell>{exp.totalPrice}</TableCell>
                        <TableCell align="right">
                            <EditButton
                                tooltipText={"Modifier Charge"}
                                openDialogWithType={() => handleOpenDialogType(ModalTypeEnum.UPDATE, exp)}
                                disable={exp.orderId > 0}
                            />
                            <DeleteButton
                                tooltipText={"Supprimer Charge"}
                                openDialogWithType={() => handleOpenDialogType(ModalTypeEnum.DELETE, exp)}
                                disable={exp.orderId > 0}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Pagination paginationController={paginationController} />
        </Table>
    );
}

export default ExpenseList;