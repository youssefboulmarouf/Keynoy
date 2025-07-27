import {ColorJson, ModalTypeEnum} from "../../../model/KeynoyModels";
import {getActionButton} from "../../common/Utilities";
import React, {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import LoadingComponent from "../../common/LoadingComponent";
import {Stack} from "@mui/system";
import FormLabel from "../../common/FormLabel";
import Button from "@mui/material/Button";

interface ColorDialogProps {
    selectedColor: ColorJson;
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
    addColor: (color: ColorJson) => void;
    editColor: (color: ColorJson) => void;
    removeColor: (color: ColorJson) => void;
}

const CityDialog: React.FC<ColorDialogProps> = ({
    selectedColor,
    dialogType,
    openDialog,
    closeDialog,
    addColor,
    editColor,
    removeColor
}) => {
    const [colorName, setColorName] = useState<string>("");
    const [colorHtmlCode, setColorHtmlCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setColorName(selectedColor.name);
        setColorHtmlCode(selectedColor.htmlCode);
    }, [selectedColor]);

    const handleSubmit = async () => {
        if (colorName === "" || colorHtmlCode === "") return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.DELETE) {
            await removeColor(selectedColor);
        } else if (dialogType === ModalTypeEnum.ADD) {
            await addColor({
                id: 0,
                name: colorName,
                htmlCode: colorHtmlCode
            });
        } else {
            await editColor({
                id: selectedColor.id,
                name: colorName,
                htmlCode: colorHtmlCode
            });
        }

        setIsLoading(false);
        closeDialog()
    }

    const handleClose = () => {
        setColorName("");
        setColorHtmlCode("");
        closeDialog()
    }

    const actionButton = getActionButton(dialogType, handleSubmit, `${dialogType} Couleur`);

    return (
        <Dialog open={openDialog} onClose={() => handleClose()} PaperProps={{sx: {width: '700px', maxWidth: '700px'}}}>
            <DialogTitle sx={{ mt: 2 }}>{dialogType} Ville</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <LoadingComponent message="Action en cours" />
                ) : (
                    <Stack spacing={2}>
                        <FormLabel>Id</FormLabel>
                        <TextField fullWidth value={selectedColor.id === 0 ? "" : selectedColor.id} disabled/>

                        <FormLabel>Nom Couleur</FormLabel>
                        <TextField
                            fullWidth
                            value={colorName}
                            onChange={(e: any) => setColorName(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Code HTML</FormLabel>
                        <TextField
                            fullWidth
                            value={colorHtmlCode}
                            onChange={(e: any) => setColorHtmlCode(e.target.value)}
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