import React from "react";
import {Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {ButtonProps} from "./ButtonProps";

const ViewButton: React.FC<ButtonProps> = ({tooltipText, openDialogWithType, disable = false}) => {
    return (
        <Tooltip title={tooltipText}>
            <IconButton
                color="primary"
                onClick={openDialogWithType}
                disabled={disable}
            >
                <RemoveRedEyeIcon width={22} />
            </IconButton>
        </Tooltip>
    )
}

export default ViewButton;