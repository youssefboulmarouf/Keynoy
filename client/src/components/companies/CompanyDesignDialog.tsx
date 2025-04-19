import {ColorJson, CompanyDesignJson, CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useState} from "react";

interface CompanyDesignDialogProps {
    concernedCompany: CompanyJson;
    companyDesigns: CompanyDesignJson[];
    openDialog: boolean;
    closeDialog: () => void;
    addDesign: (designs: CompanyDesignJson[]) => void;
}

export const CompanyDesignDialog: React.FC<CompanyDesignDialogProps> = ({concernedCompany, companyDesigns, openDialog, closeDialog, addDesign}) => {
    const [nomDesign, setNomDesign] = useState<string>("");
    const [urlDesign, setUrlDesign] = useState<string>("");

    const handleAddDesign = () => {
        addDesign([
            ...companyDesigns,
            {id: 0, designName: nomDesign, designUrl: urlDesign, companyId: concernedCompany.id}
        ]);
        setNomDesign("");
        setUrlDesign("");
        closeDialog();
    };

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>Ajouter Design: {concernedCompany.name}</DialogTitle>

            <DialogContent>
                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Nom Design</Typography>
                <TextField
                    fullWidth
                    value={nomDesign}
                    onChange={(e: any) => setNomDesign(e.target.value)}
                />

                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Lien Design (Google Drive)</Typography>
                <TextField
                    fullWidth
                    value={urlDesign}
                    onChange={(e: any) => setUrlDesign(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleAddDesign}>Ajputer Nouveau Design</Button>
                <Button variant="outlined" onClick={() => closeDialog()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CompanyDesignDialog;