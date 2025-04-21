import {CompanyDesignJson, DesignImageJson} from "../../model/KeynoyModels";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useState} from "react";

interface DesignImageDialogProps {
    concernedCompanyDesign: CompanyDesignJson;
    openDialog: boolean;
    closeDialog: () => void;
    onAddDesignImage: (companyDesign: CompanyDesignJson, newImage: DesignImageJson) => void;
}

export const DesignImageDialog: React.FC<DesignImageDialogProps> = ({concernedCompanyDesign, openDialog, closeDialog, onAddDesignImage}) => {
    const [urlDesign, setUrlDesign] = useState<string>("");

    const handleAddImage = () => {
        if (!urlDesign.trim()) return;

        const newImage: DesignImageJson = {
            id: 0,
            imageUrl: urlDesign,
            companyDesignId: concernedCompanyDesign.id
        };

        onAddDesignImage(concernedCompanyDesign, newImage);
        setUrlDesign("");
        closeDialog();
    };

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>Ajouter Design: {concernedCompanyDesign.designName}</DialogTitle>

            <DialogContent>
                <Typography variant="subtitle1" fontWeight={600} component="label" sx={{ display: "flex", mt: 2 }}>Lien Image</Typography>
                <TextField
                    fullWidth
                    value={urlDesign}
                    onChange={(e: any) => setUrlDesign(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleAddImage}>Ajouter Image</Button>
                <Button variant="outlined" onClick={() => closeDialog()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DesignImageDialog;