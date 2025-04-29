import React, {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {CompanyDesignJson, CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import {getActionButton} from "../common/Utilities";
import FormLabel from "../common/FormLabel";
import LoadingComponent from "../common/LoadingComponent";

interface CompanyDialogProps {
    selectedCompany: CompanyJson;
    dialogType: ModalTypeEnum;
    companyType: string;
    openDialog: boolean;
    closeDialog: () => void;
    addCompany: (company: CompanyJson) => void;
    removeCompany: (company: CompanyJson) => void;
    editCompany: (company: CompanyJson) => void;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({
    selectedCompany,
    dialogType,
    companyType,
    openDialog,
    closeDialog,
    addCompany,
    editCompany,
    removeCompany
}) => {
    const [companyName, setCompanyName] = useState<string>("");
    const [companyPhone, setCompanyPhone] = useState<string>("");
    const [companyLocation, setCompanyLocation] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setCompanyName(selectedCompany.name);
        setCompanyPhone(selectedCompany.phone);
        setCompanyLocation(selectedCompany.location);
    }, [selectedCompany]);

    const handleSubmit = async () => {
        setIsLoading(true);

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeCompany(selectedCompany);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addCompany({
                id: 0,
                name: companyName,
                phone: companyPhone,
                location: companyLocation,
                companyType: companyType,
            });
        } else {
            await editCompany({
                id: selectedCompany.id,
                name: companyName,
                phone: companyPhone,
                location: companyLocation,
                companyType: companyType
            });
        }

        setIsLoading(false);
        closeDialog()
    }

    const actionButton = getActionButton(dialogType, handleSubmit, `${dialogType} ${companyType}`);

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '900px', maxWidth: '900px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{dialogType} {companyType}</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <LoadingComponent message="Action en cours" />
                ) : (
                    <Stack spacing={2}>
                        <FormLabel>Id</FormLabel>
                        <TextField fullWidth value={selectedCompany.id === 0 ? "" : selectedCompany.id} disabled/>

                        <FormLabel>Nom {companyType}</FormLabel>
                        <TextField
                            fullWidth
                            value={companyName}
                            onChange={(e: any) => setCompanyName(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Phone {companyType}</FormLabel>
                        <TextField
                            fullWidth
                            value={companyPhone}
                            onChange={(e: any) => setCompanyPhone(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Ville {companyType}</FormLabel>
                        <TextField
                            fullWidth
                            value={companyLocation}
                            onChange={(e: any) => setCompanyLocation(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />
                    </Stack>
                )}

            </DialogContent>
            <DialogActions>
                {actionButton}
                <Button variant="outlined" onClick={() => closeDialog()}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default CompanyDialog;