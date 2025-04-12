import React from "react";
import {CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import LoadingComponent from "../common/LoadingComponent";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";

interface CompaniesListProps {
    isLoading: boolean;
    isError: boolean;
    type: string;
    data: CompanyJson[];
    handleOpenDialogType: (type: ModalTypeEnum, company: CompanyJson) => void;
}

const CompaniesList: React.FC<CompaniesListProps> = ({isLoading, isError, type, data, handleOpenDialogType}) => {
    let listCompanies;
    if (isLoading) {
        listCompanies = <LoadingComponent message="Loading product types" />;
    } else if (isError) {
        listCompanies = <Typography color="error">Error loading {type}</Typography>;
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
                            <TableCell align="right">
                                <EditButton tooltipText={"Modifier Partenaire"} entity={comp} handleOpenDialogType={handleOpenDialogType}/>
                                <DeleteButton tooltipText={"Supprimer Partenaire"} entity={comp} handleOpenDialogType={handleOpenDialogType}/>
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