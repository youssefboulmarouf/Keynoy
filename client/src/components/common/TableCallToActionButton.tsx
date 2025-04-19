import { Box, Button } from "@mui/material";

interface TableCallToActionButtonProps {
    callToActionText: string;
    callToActionFunction: () => void;
    fullwidth: boolean
}

const TableCallToActionButton: React.FC<TableCallToActionButtonProps> = ({callToActionText, callToActionFunction, fullwidth}) => {
    return (
        <Box display="flex" gap={1}>
            <Button fullWidth={fullwidth} variant="contained" color="primary" onClick={() => callToActionFunction()}>
                {callToActionText}
            </Button>
        </Box>
    );
};

export default TableCallToActionButton;
