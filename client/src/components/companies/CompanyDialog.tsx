import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {CompanyDesignJson, CompanyJson, CompanyTypeEnum, ModalTypeEnum} from "../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {useCompaniesContext} from "../../context/CompaniesContext";
import TableCallToActionButton from "../common/TableCallToActionButton";
import CompanyDesignDialog from "./CompanyDesignDialog";
import CompanyDesignList from "./CompanyDesignList";

interface CompanyDialogProps {
    concernedCompany: CompanyJson
    dialogType: ModalTypeEnum;
    companyType: string;
    openDialog: boolean;
    closeDialog: () => void;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({concernedCompany, dialogType, companyType, openDialog, closeDialog}) => {
    const [companyName, setCompanyName] = useState<string>("");
    const [companyPhone, setCompanyPhone] = useState<string>("");
    const [companyLocation, setCompanyLocation] = useState<string>("");
    const [companyDesigns, setCompanyDesigns] = useState<CompanyDesignJson[]>([]);

    const companyDesignDialog = useDialogController<null>(null);

    const {addCompany, editCompany, removeCompany} = useCompaniesContext();

    useEffect(() => {
        setCompanyName(concernedCompany.name);
        setCompanyPhone(concernedCompany.phone);
        setCompanyLocation(concernedCompany.location);
        setCompanyDesigns(concernedCompany.companyDesigns);
    }, [concernedCompany]);

    const handleSubmit = () => {
        if (dialogType === ModalTypeEnum.DELETE) {
            removeCompany(concernedCompany);
        } else if (dialogType === ModalTypeEnum.ADD) {
            addCompany({
                id: 0,
                name: companyName,
                phone: companyPhone,
                location: companyLocation,
                companyType: companyType,
                companyDesigns: companyDesigns
            });
        } else {
            editCompany({
                id: concernedCompany.id,
                name: companyName,
                phone: companyPhone,
                location: companyLocation,
                companyType: companyType,
                companyDesigns: companyDesigns
            });
        }
        closeDialog()
    }

    let actionText = `${dialogType} ${companyType}`;
    let actionButton;
    if (dialogType === ModalTypeEnum.DELETE) {
        actionButton = <Button variant="contained" color="error" onClick={handleSubmit}>{actionText}</Button>
    } else if (dialogType === ModalTypeEnum.ADD) {
        actionButton = <Button variant="contained" color="primary" onClick={handleSubmit}>{actionText}</Button>
    } else {
        actionButton = <Button variant="contained" color="warning" onClick={handleSubmit}>{actionText}</Button>
    }

    return (
        <>
            <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '900px', maxWidth: '900px'}}}>
                <DialogTitle sx={{ mt: 2 }}>{actionText}</DialogTitle>
                <DialogContent>

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Id</Typography>
                    <TextField fullWidth value={concernedCompany.id === 0 ? "" : concernedCompany.id} disabled/>

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Nom {companyType}</Typography>
                    <TextField
                        fullWidth
                        value={companyName}
                        onChange={(e: any) => setCompanyName(e.target.value)}
                        disabled={dialogType === ModalTypeEnum.DELETE}
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Phone {companyType}</Typography>
                    <TextField
                        fullWidth
                        value={companyPhone}
                        onChange={(e: any) => setCompanyPhone(e.target.value)}
                        disabled={dialogType === ModalTypeEnum.DELETE}
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Ville {companyType}</Typography>
                    <TextField
                        fullWidth
                        value={companyLocation}
                        onChange={(e: any) => setCompanyLocation(e.target.value)}
                        disabled={dialogType === ModalTypeEnum.DELETE}
                        sx={{ mb: 2 }}
                    />

                    {companyType === CompanyTypeEnum.CUSTOMERS ? (
                        <>
                            <TableCallToActionButton
                                fullwidth={true}
                                callToActionText="Ajouter Design"
                                callToActionFunction={() => {companyDesignDialog.openDialog(ModalTypeEnum.ADD, null)}}
                            />
                            <CompanyDesignList
                                companyDesigns={companyDesigns}
                                onChangeCompanyDesign={setCompanyDesigns}
                                disabled={dialogType === ModalTypeEnum.DELETE}
                            />
                        </>
                    ) : ('')}

                </DialogContent>
                <DialogActions>
                    {actionButton}
                    <Button variant="outlined" onClick={() => closeDialog()}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <CompanyDesignDialog
                concernedCompany={concernedCompany}
                companyDesigns={companyDesigns}
                openDialog={companyDesignDialog.open}
                closeDialog={companyDesignDialog.closeDialog}
                addDesign={setCompanyDesigns}
            />
        </>

    );
}
export default CompanyDialog;