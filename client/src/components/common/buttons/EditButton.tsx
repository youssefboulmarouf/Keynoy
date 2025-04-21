import IconButton from "@mui/material/IconButton";
import {Tooltip} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import {ButtonProps} from "./ButtonProps";

const EditButton: React.FC<ButtonProps> = ({tooltipText, handleOpenDialogType, disable = false}) => {
    return (
        <Tooltip title={tooltipText}>
            <IconButton
                color="warning"
                onClick={handleOpenDialogType}
                disabled={disable}
            >
                <EditIcon width={22} />
            </IconButton>
        </Tooltip>
    )
}

export default EditButton;