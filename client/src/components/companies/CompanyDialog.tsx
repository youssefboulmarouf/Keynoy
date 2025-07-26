import React, {useEffect, useState} from "react";
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {CityJson, CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import {getActionButton} from "../common/Utilities";
import FormLabel from "../common/FormLabel";
import LoadingComponent from "../common/LoadingComponent";

interface CompanyDialogProps {
    selectedCompany: CompanyJson;
    cities: CityJson[];
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
    cities,
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
    const [companyCity, setCompanyCity] = useState<CityJson | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setCompanyName(selectedCompany.name);
        setCompanyPhone(selectedCompany.phone);
        setCompanyCity(cities.find(c => c.id === selectedCompany.cityId) ?? null);
    }, [selectedCompany]);

    const handleSubmit = async () => {
        if (companyCity === null || companyName === "") return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeCompany(selectedCompany);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addCompany({
                id: 0,
                name: companyName,
                phone: companyPhone,
                cityId: companyCity.id,
                companyType: companyType,
            });
        } else {
            await editCompany({
                id: selectedCompany.id,
                name: companyName,
                phone: companyPhone,
                cityId: companyCity.id,
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
                        <Autocomplete
                            options={cities}
                            fullWidth
                            getOptionKey={(options) => options.id}
                            getOptionLabel={(options) => options.name}
                            value={companyCity}
                            onChange={(event: React.SyntheticEvent, newValue: CityJson | null) => {
                                setCompanyCity(newValue)
                            }}
                            renderInput={(params) => <TextField {...params} placeholder="Ville" />}
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