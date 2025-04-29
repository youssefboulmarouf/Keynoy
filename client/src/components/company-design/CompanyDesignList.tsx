import {CompanyDesignJson, CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React from "react";
import DeleteButton from "../common/buttons/DeleteButton";
import DesignImageGrid from "./design-image/DesignImageGrid";
import {useDialogController} from "../common/useDialogController";
import EditButton from "../common/buttons/EditButton";

interface CompanyDesignGridProps {
    companyDesigns: CompanyDesignJson[];
    companies: CompanyJson[];
    openCompanyDesignDialogWithType: (type: ModalTypeEnum, companyDesign: CompanyDesignJson) => void;
}

const CompanyDesignList: React.FC<CompanyDesignGridProps> = ({companyDesigns, companies, openCompanyDesignDialogWithType}) => {
    const companyDesignDialog = useDialogController<CompanyDesignJson>({
        id: 0,
        designName: "",
        designImages: [],
        companyId: 0
    });

    // const handleRemoveCompanyDesign = (modalType: ModalTypeEnum, design: CompanyDesignJson) => {
    //     onChangeCompanyDesign(companyDesigns.filter(d => d.id !== design.id));
    // }
    //
    // const handleRemoveDesignImage = (cd: CompanyDesignJson, imageId: number) => {
    //     onChangeCompanyDesign(companyDesigns.map((d) => {
    //         if (d.id === cd.id) {
    //             return {
    //                 ...d,
    //                 designImages: d.designImages.filter((img) => img.id !== imageId)
    //             };
    //         }
    //         return d;
    //     }));
    // }
    //
    // const handleAddDesignImage = (cd: CompanyDesignJson, image: DesignImageJson) => {
    //     onChangeCompanyDesign(companyDesigns.map((d) => {
    //         if (d.id === cd.id) {
    //             return {
    //                 ...d,
    //                 designImages: [...d.designImages, image]
    //             };
    //         }
    //         return d;
    //     }));
    // };

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Nom</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Client</Typography></TableCell>
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
            </Table>

            {/*<DesignImageDialog*/}
            {/*    openDialog={companyDesignDialog.open}*/}
            {/*    closeDialog={companyDesignDialog.closeDialog}*/}
            {/*    concernedCompanyDesign={companyDesignDialog.data}*/}
            {/*    onAddDesignImage={handleAddDesignImage}*/}
            {/*/>*/}
        </>
    );
}

export default CompanyDesignList;