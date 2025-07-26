import React from "react";
import {CityJson, CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import EditButton from "../common/buttons/EditButton";
import DeleteButton from "../common/buttons/DeleteButton";
import {usePaginationController} from "../common/usePaginationController";
import Pagination from "../common/Pagination";

interface CompaniesListProps {
    companyType: string;
    companies: CompanyJson[];
    cities: CityJson[];
    openCompanyDialogWithType: (type: ModalTypeEnum, company: CompanyJson) => void;
}

const CompaniesList: React.FC<CompaniesListProps> = ({companyType, companies, cities, openCompanyDialogWithType}) => {
    const paginationController = usePaginationController<CompanyJson>(companies);
    if (companies.length === 0) return <Typography>Aucun {companyType} trouver</Typography>;
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom {companyType}</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Phone</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Ville</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginationController.data.map((comp) => (
                    <TableRow key={comp.id}>
                        <TableCell>{comp.id}</TableCell>
                        <TableCell>{comp.name}</TableCell>
                        <TableCell>{comp.phone}</TableCell>
                        <TableCell>{cities.find(city => city.id === comp.cityId)?.name}</TableCell>
                        <TableCell align="right">
                            <EditButton
                                tooltipText={`Modifier ${companyType}`}
                                openDialogWithType={() => openCompanyDialogWithType(ModalTypeEnum.UPDATE, comp)}
                            />
                            <DeleteButton
                                tooltipText={`Supprimer  ${companyType}`}
                                openDialogWithType={() => openCompanyDialogWithType(ModalTypeEnum.DELETE, comp)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Pagination paginationController={paginationController}/>
        </Table>
    );
}

export default CompaniesList;