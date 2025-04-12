import IconButton from "@mui/material/IconButton";
import {ModalTypeEnum} from "../../model/KeynoyModels";
import {Tooltip} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

interface EditButtonProps {
    tooltipText: string;
    entity: any;
    handleOpenDialogType: (modalType: ModalTypeEnum, entity: any) => void;
}

const EditButton: React.FC<EditButtonProps> = ({tooltipText, entity, handleOpenDialogType}) => {
    return (
        <Tooltip title={tooltipText}>
            <IconButton
                color="warning"
                onClick={() => handleOpenDialogType(ModalTypeEnum.DELETE, entity)}
            >
                <EditIcon width={22} />
            </IconButton>
        </Tooltip>
    )
}

export default EditButton;