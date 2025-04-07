import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";

interface ProductTypeDialogProps {
    dialogType: string;
    openDialog: boolean;
    closeDialog: () => void;
}

const ProductTypeDialog: React.FC<ProductTypeDialogProps> = ({dialogType, openDialog, closeDialog}) => {
    let actionText = `${dialogType} Type Produit`;
    let actionButton;
    if (dialogType === 'Supprimer') {
        actionButton = <Button variant="contained" color="error">{actionText}</Button>
    } else if (dialogType === 'Ajouter') {
        actionButton = <Button variant="contained" color="primary">{actionText}</Button>
    } else {
        actionButton = <Button variant="contained" color="warning">{actionText}</Button>
    }

    return (
        <Dialog open={openDialog} onClose={() => closeDialog()}>
            <DialogTitle>{actionText}</DialogTitle>
            <DialogContent>

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

export default ProductTypeDialog;