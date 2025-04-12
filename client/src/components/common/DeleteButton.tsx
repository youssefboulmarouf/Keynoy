import IconButton from "@mui/material/IconButton";
import {ModalTypeEnum} from "../../model/KeynoyModels";
import DeleteIcon from "@mui/icons-material/Delete";
import {Tooltip} from "@mui/material";
import React from "react";

interface DeleteButtonProps {
    tooltipText: string;
    entity: any;
    handleOpenDialogType: (modalType: ModalTypeEnum, entity: any) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({tooltipText, entity, handleOpenDialogType}) => {
    return (
        <Tooltip title={tooltipText}>
            <IconButton
                color="error"
                onClick={() => handleOpenDialogType(ModalTypeEnum.DELETE, entity)}
            >
                <DeleteIcon width={22} />
            </IconButton>
        </Tooltip>
    )
}

export default DeleteButton;