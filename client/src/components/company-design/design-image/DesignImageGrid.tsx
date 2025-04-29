import React from "react";
import {DesignImageJson} from "../../../model/KeynoyModels";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

interface DesignImageGridProps {
    designImages: DesignImageJson[];
    removeImage: (image: DesignImageJson) => void;
    showRemoveButton?: boolean;
    disabled?: boolean;
}

const DesignImageGrid: React.FC<DesignImageGridProps> = ({designImages, removeImage, showRemoveButton = false, disabled = false}) => {
    return (
        <Stack direction="row" sx={{ mt: 2 }}>
            {designImages.map((designImage) => (
                <Box key={designImage.id} sx={{ width: 100, textAlign: "center" }}>
                    <Stack direction="column">
                        <img
                            src={designImage.imageUrl}
                            style={{ width: 50, height: 50, borderRadius: 8, border: "1px solid #ccc" }}
                        />
                        {showRemoveButton ? (
                            <IconButton
                                color="error"
                                onClick={() => removeImage(designImage)}
                                sx={{width: 50}}
                                disabled={disabled}
                            >
                                <ClearIcon width={22} />
                            </IconButton>
                        ) : ('')}
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
}

export default DesignImageGrid;