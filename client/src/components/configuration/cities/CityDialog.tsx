import {CityJson, ModalTypeEnum} from "../../../model/KeynoyModels";
import {getActionButton} from "../../common/Utilities";
import React, {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import LoadingComponent from "../../common/LoadingComponent";
import {Stack} from "@mui/system";
import FormLabel from "../../common/FormLabel";
import Button from "@mui/material/Button";

interface CityDialogProps {
    selectedCity: CityJson;
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
    addCity: (city: CityJson) => void;
    editCity: (city: CityJson) => void;
    removeCity: (city: CityJson) => void;
}

const CityDialog: React.FC<CityDialogProps> = ({
    selectedCity,
    dialogType,
    openDialog,
    closeDialog,
    addCity,
    editCity,
    removeCity
}) => {
    const [cityName, setCityName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setCityName(selectedCity.name);
    }, [selectedCity]);

    const handleSubmit = async () => {
        if (cityName === "") return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeCity(selectedCity);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addCity({
                id: 0,
                name: cityName
            });
        } else {
            await editCity({
                id: selectedCity.id,
                name: cityName
            });
        }

        setIsLoading(false);
        closeDialog()
    }

    const handleClose = () => {
        setCityName("");
        closeDialog()
    }

    const actionButton = getActionButton(dialogType, handleSubmit, `${dialogType} Ville`);

    return (
        <Dialog open={openDialog} onClose={() => handleClose()} PaperProps={{sx: {width: '700px', maxWidth: '700px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{dialogType} Ville</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <LoadingComponent message="Action en cours" />
                ) : (
                    <Stack spacing={2}>
                        <FormLabel>Id</FormLabel>
                        <TextField fullWidth value={selectedCity.id === 0 ? "" : selectedCity.id} disabled/>

                        <FormLabel>Nom Ville</FormLabel>
                        <TextField
                            fullWidth
                            value={cityName}
                            onChange={(e: any) => setCityName(e.target.value)}
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
    )
}

export default CityDialog;