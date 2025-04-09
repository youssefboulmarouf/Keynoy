import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {useCreateCompanyHook, useDeleteCompanyHook, useUpdateCompanyHook} from "../../hooks/CompaniesHook";
import LoadingComponent from "../common/LoadingComponent";

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

    const { mutate: createCompany, isPending: pendingAdd} = useCreateCompanyHook();
    const { mutate: updateCompany, isPending: pendingUpdate} = useUpdateCompanyHook();
    const { mutate: deleteCompany, isPending: pendingDelete} = useDeleteCompanyHook();

    useEffect(() => {
        setCompanyName(concernedCompany.name);
        setCompanyPhone(concernedCompany.phone);
        setCompanyLocation(concernedCompany.location);
    }, [concernedCompany]);

    const handleSubmit = () => {
        if (dialogType === ModalTypeEnum.DELETE) {
            deleteCompany(
                concernedCompany,
                { onSuccess: () => { closeDialog() }}
            );
        } else if (dialogType === ModalTypeEnum.ADD) {
            createCompany(
                { id: 0, name: companyName, phone: companyPhone, location: companyLocation, type: companyType },
                { onSuccess: () => { closeDialog() }}
            );
        } else {
            updateCompany(
                { id: concernedCompany.id, name: companyName, phone: companyPhone, location: companyLocation, type: companyType },
                { onSuccess: () => { closeDialog() }}
            );
        }
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
        <Dialog open={openDialog} onClose={() => closeDialog()}>
            <DialogTitle sx={{ width: "500px", mt: 2 }}>{actionText}</DialogTitle>
            <DialogContent>

                {(pendingUpdate || pendingAdd || pendingDelete) ? (<LoadingComponent message={''}/>) : ('')}

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Id</Typography>
                <TextField fullWidth value={concernedCompany.id === 0 ? "" : concernedCompany.id} disabled/>

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Nom {companyType}</Typography>
                <TextField
                    fullWidth
                    value={companyName}
                    onChange={(e: any) => setCompanyName(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE || (pendingUpdate || pendingAdd || pendingDelete)}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Phone {companyType}</Typography>
                <TextField
                    fullWidth
                    value={companyPhone}
                    onChange={(e: any) => setCompanyPhone(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE || (pendingUpdate || pendingAdd || pendingDelete)}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Ville {companyType}</Typography>
                <TextField
                    fullWidth
                    value={companyLocation}
                    onChange={(e: any) => setCompanyLocation(e.target.value)}
                    disabled={dialogType === ModalTypeEnum.DELETE || (pendingUpdate || pendingAdd || pendingDelete)}
                />

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