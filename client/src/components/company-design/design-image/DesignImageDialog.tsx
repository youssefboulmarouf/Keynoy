import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import {DesignImageJson} from "../../../model/KeynoyModels";

interface DesignImageDialogProps {
    openDialog: boolean;
    closeDialog: () => void;
    addImage: (image: DesignImageJson) => void;
}

export const DesignImageDialog: React.FC<DesignImageDialogProps> = ({openDialog, closeDialog, addImage}) => {
    const [urlDesign, setUrlDesign] = useState<string>("");

    const handleAddImage = () => {
        if (!urlDesign.trim()) return;

        addImage({
            id: 0,
            imageUrl: urlDesign,
            companyDesignId: 0
        });
        setUrlDesign("");
        closeDialog();
    };

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()} PaperProps={{sx: {width: '500px', maxWidth: '500px'}}}>
            <DialogTitle sx={{ mt: 2 }}>Ajouter Image</DialogTitle>

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