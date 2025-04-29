import {CompanyDesignJson, CompanyJson, DesignImageJson, ModalTypeEnum,} from "../../model/KeynoyModels";
import {Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import FormLabel from "../common/FormLabel";
import TableCallToActionButton from "../common/TableCallToActionButton";
import DesignImageGrid from "./design-image/DesignImageGrid";
import {getActionButton} from "../common/Utilities";
import DesignImageDialog from "./design-image/DesignImageDialog";
import {useDialogController} from "../common/useDialogController";
import LoadingComponent from "../common/LoadingComponent";

interface CompanyDesignDialogProps {
    selectedCompanyDesign: CompanyDesignJson;
    companies: CompanyJson[];
    dialogType: ModalTypeEnum;
    openDialog: boolean;
    closeDialog: () => void;
    addDesign: (companyDesign: CompanyDesignJson) => void;
    editDesign: (companyDesign: CompanyDesignJson) => void;
    removeDesign: (companyDesign: CompanyDesignJson) => void;
}

export const CompanyDesignDialog: React.FC<CompanyDesignDialogProps> = ({
    selectedCompanyDesign,
    companies,
    dialogType,
    openDialog,
    closeDialog,
    addDesign,
    editDesign,
    removeDesign
}) => {
    const [designName, setDesignName] = useState<string>("");
    const [company, setCompany] = useState<CompanyJson | null>(null);
    const [designImages, setDesignImages] = useState<DesignImageJson[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const imageDialog = useDialogController<DesignImageJson>({id: 0, companyDesignId: 0, imageUrl: ""});

    useEffect(() => {
        setDesignName(selectedCompanyDesign.designName)
        setCompany(companies.find(c => c.id === selectedCompanyDesign.companyId) ?? null);
        setDesignImages(selectedCompanyDesign.designImages)
    }, [selectedCompanyDesign]);

    const handleSubmit = async () => {
        if (!company) return;

        setIsLoading(true);

        if (dialogType === ModalTypeEnum.ADD) {
            await addDesign({
                id: 0,
                designName,
                designImages,
                companyId: company.id
            })
        } else if (dialogType === ModalTypeEnum.UPDATE) {
            await editDesign({
                id: selectedCompanyDesign.id,
                designName,
                designImages,
                companyId: company.id
            })
        } else {
            await removeDesign(selectedCompanyDesign)
        }

        setIsLoading(false);
        closeDialog();
    };

    const handleAddImage = (image: DesignImageJson) => {
        setDesignImages([...designImages, image]);
    }

    const handleRemoveImage = (image: DesignImageJson) => {
        setDesignImages(designImages.filter(i => i.imageUrl !== image.imageUrl));
    }

    const actionButton = getActionButton(
        dialogType,
        handleSubmit,
        `${dialogType} Design`,
        !designName || !company
    );

    return (
        <>
            <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '700px', maxWidth: '700px'}}}>
                <DialogTitle sx={{ mt: 2 }}>Ajouter Design</DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <LoadingComponent message="Action en cours" />
                    ) : (
                        <Stack spacing={2}>
                        <FormLabel>Nom Design</FormLabel>
                        <TextField
                            fullWidth
                            value={designName}
                            onChange={(e: any) => setDesignName(e.target.value)}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />

                        <FormLabel>Company</FormLabel>
                        <Autocomplete
                            options={companies}
                            fullWidth
                            getOptionLabel={(options) => options.name}
                            value={company}
                            onChange={(event: React.SyntheticEvent, newValue: CompanyJson | null) =>
                                setCompany(newValue)
                            }
                            renderInput={(params) => <TextField {...params} placeholder="Client" />}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                            sx={{ mb: 2 }}
                        />

                        <TableCallToActionButton
                            fullwidth={true}
                            callToActionText="Ajouter Image"
                            callToActionFunction={() => imageDialog.openDialog(ModalTypeEnum.ADD, {id: 0, companyDesignId: 0, imageUrl: ""})}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />
                        <FormLabel>Design Images</FormLabel>
                        <DesignImageGrid
                            designImages={designImages}
                            removeImage={handleRemoveImage}
                            showRemoveButton={true}
                            disabled={dialogType === ModalTypeEnum.DELETE}
                        />
                    </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    {actionButton}
                    <Button variant="outlined" onClick={() => closeDialog()}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <DesignImageDialog
                openDialog={imageDialog.open}
                closeDialog={imageDialog.closeDialog}
                addImage={handleAddImage}
            />
        </>

    );
}

export default CompanyDesignDialog;