import {CompanyDesignJson, DesignImageJson, ModalTypeEnum} from "../../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React from "react";
import DeleteButton from "../../common/buttons/DeleteButton";
import DesignImageGrid from "./design-image/DesignImageGrid";
import AddButton from "../../common/buttons/AddButton";
import DesignImageDialog from "./design-image/DesignImageDialog";
import {useDialogController} from "../../common/useDialogController";

interface CompanyDesignGridProps {
    companyDesigns: CompanyDesignJson[];
    onChangeCompanyDesign: (companyDesigns: CompanyDesignJson[]) => void;
    disabled?: boolean;
}

const CompanyDesignList: React.FC<CompanyDesignGridProps> = ({companyDesigns, onChangeCompanyDesign, disabled = false}) => {
    const companyDesignDialog = useDialogController<CompanyDesignJson>({
        id: 0,
        designName: "",
        designImages: [],
        companyId: 0
    });

    const handleRemoveCompanyDesign = (modalType: ModalTypeEnum, design: CompanyDesignJson) => {
        onChangeCompanyDesign(companyDesigns.filter(d => d.id !== design.id));
    }

    const handleRemoveDesignImage = (cd: CompanyDesignJson, imageId: number) => {
        onChangeCompanyDesign(companyDesigns.map((d) => {
            if (d.id === cd.id) {
                return {
                    ...d,
                    designImages: d.designImages.filter((img) => img.id !== imageId)
                };
            }
            return d;
        }));
    }

    const handleAddDesignImage = (cd: CompanyDesignJson, image: DesignImageJson) => {
        onChangeCompanyDesign(companyDesigns.map((d) => {
            if (d.id === cd.id) {
                return {
                    ...d,
                    designImages: [...d.designImages, image]
                };
            }
            return d;
        }));
    };

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Nom</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Images</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {companyDesigns.map((cd: CompanyDesignJson) => (
                        <TableRow key={cd.id+cd.designName}>
                            <TableCell>{cd.id}</TableCell>
                            <TableCell>{cd.designName}</TableCell>
                            <TableCell>
                                <DesignImageGrid
                                    companyDesign={cd}
                                    onRemoveDesignImage={handleRemoveDesignImage}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <AddButton
                                    tooltipText={`Ajouter Image`}
                                    handleOpenDialogType={() => companyDesignDialog.openDialog(ModalTypeEnum.ADD, cd)}
                                />
                                <DeleteButton
                                    tooltipText={`Supprimer Image`}
                                    handleOpenDialogType={() => handleRemoveCompanyDesign(ModalTypeEnum.DELETE, cd)}
                                    disable={disabled}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <DesignImageDialog
                openDialog={companyDesignDialog.open}
                closeDialog={companyDesignDialog.closeDialog}
                concernedCompanyDesign={companyDesignDialog.data}
                onAddDesignImage={handleAddDesignImage}
            />
        </>
    );
}

export default CompanyDesignList;