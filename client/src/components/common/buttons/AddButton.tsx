import React from "react";
import {Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import {ButtonProps} from "./ButtonProps";

const AddButton: React.FC<ButtonProps> = ({tooltipText, handleOpenDialogType, disable = false}) => {
    return (
        <Tooltip title={tooltipText}>
            <IconButton
                color="primary"
                onClick={handleOpenDialogType}
                disabled={disable}
            >
                <AddIcon width={22} />
            </IconButton>
        </Tooltip>
    )
}

export default AddButton;