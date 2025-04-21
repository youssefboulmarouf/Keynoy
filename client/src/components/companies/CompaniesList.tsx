import React from "react";
import {CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";

interface CompaniesListProps {
    loading: boolean;
    error: Error | null;
    type: string;
    data: CompanyJson[];
    handleOpenDialogType: (type: ModalTypeEnum, company: CompanyJson) => void;
}

const CompaniesList: React.FC<CompaniesListProps> = ({loading, error, type, data, handleOpenDialogType}) => {
    let listCompanies;
    if (loading) {
        listCompanies = <LoadingComponent message="Loading product types" />;
    } else if (error) {
        listCompanies = <Typography color="error">Error loading {type}: ${error?.message}</Typography>;
    } else if (data.length === 0) {
        listCompanies = <Typography>Aucun {type} trouver</Typography>;
    } else {
        listCompanies = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Nom {type}</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Phone</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Ville</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Designs</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((comp) => (
                        <TableRow key={comp.id}>
                            <TableCell>{comp.id}</TableCell>
                            <TableCell>{comp.name}</TableCell>
                            <TableCell>{comp.phone}</TableCell>
                            <TableCell>{comp.location}</TableCell>
                            <TableCell>{comp.companyDesigns.length}</TableCell>
                            <TableCell align="right">
                                <EditButton
                                    tooltipText={`Modifier ${type}`}
                                    handleOpenDialogType={() => handleOpenDialogType(ModalTypeEnum.UPDATE, comp)}
                                />
                                <DeleteButton
                                    tooltipText={`Supprimer  ${type}`}
                                    handleOpenDialogType={() => handleOpenDialogType(ModalTypeEnum.DELETE, comp)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return (<>{listCompanies}</>)
}

export default CompaniesList;