import {CompanyDesignJson, CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React from "react";
import DeleteButton from "../common/buttons/DeleteButton";
import DesignImageGrid from "./design-image/DesignImageGrid";
import EditButton from "../common/buttons/EditButton";
import {usePaginationController} from "../common/usePaginationController";
import Pagination from "../common/Pagination";

interface CompanyDesignGridProps {
    companyDesigns: CompanyDesignJson[];
    companies: CompanyJson[];
    openCompanyDesignDialogWithType: (type: ModalTypeEnum, companyDesign: CompanyDesignJson) => void;
}

const CompanyDesignList: React.FC<CompanyDesignGridProps> = ({companyDesigns, companies, openCompanyDesignDialogWithType}) => {
    const paginationController = usePaginationController<CompanyDesignJson>(companyDesigns);
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Client</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Telephone Client</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Images</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {companyDesigns.map((cd: CompanyDesignJson) => (
                    <TableRow key={cd.id+cd.designName}>
                        <TableCell>{cd.id}</TableCell>
                        <TableCell>{cd.designName}</TableCell>
                        <TableCell>{companies.find(c => c.id === cd.companyId)?.name}</TableCell>
                        <TableCell>{companies.find(c => c.id === cd.companyId)?.phone}</TableCell>
                        <TableCell>
                            <DesignImageGrid
                                designImages={cd.designImages}
                                removeImage={() => {}}
                            />
                        </TableCell>
                        <TableCell align="right">
                            <EditButton
                                tooltipText={`Modifier Design`}
                                openDialogWithType={() => openCompanyDesignDialogWithType(ModalTypeEnum.UPDATE, cd)}
                            />
                            <DeleteButton
                                tooltipText={`Supprimer Design`}
                                openDialogWithType={() => openCompanyDesignDialogWithType(ModalTypeEnum.DELETE, cd)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Pagination paginationController={paginationController}/>
        </Table>
    );
}

export default CompanyDesignList;