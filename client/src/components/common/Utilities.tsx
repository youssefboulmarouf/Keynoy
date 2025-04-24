import Button from "@mui/material/Button";
import {ModalTypeEnum} from "../../model/KeynoyModels";

export const getActionButton = (type: ModalTypeEnum, onClick: () => void, label?: string) => {
    const colorMap = {
        [ModalTypeEnum.ADD]: "primary",
        [ModalTypeEnum.UPDATE]: "warning",
        [ModalTypeEnum.DELETE]: "error",
    } as const;

    return (
        <Button variant="contained" color={colorMap[type]} onClick={onClick}>
            {label || `${type} Item`}
        </Button>
    );
};