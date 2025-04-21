import React from "react";
import {CompanyDesignJson} from "../../model/KeynoyModels";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

interface DesignImageGridProps {
    companyDesign: CompanyDesignJson;
    onRemoveDesignImage: (cd: CompanyDesignJson, imageId: number) => void;
    disabled?: boolean;
}

const DesignImageGrid: React.FC<DesignImageGridProps> = ({companyDesign, onRemoveDesignImage, disabled = false}) => {
    return (
        <Stack direction="row">
            {companyDesign.designImages.map((designImage) => (
                <Box key={designImage.id} sx={{ width: 100, textAlign: "center" }}>
                    <Stack direction="column">
                        <img
                            src={designImage.imageUrl}
                            style={{ width: 50, height: 50, borderRadius: 8, border: "1px solid #ccc" }}
                        />
                        <IconButton
                            color="error"
                            onClick={() => onRemoveDesignImage(companyDesign, designImage.id)}
                            sx={{width: 50}}
                            disabled={disabled}
                        >
                            <ClearIcon width={22} />
                        </IconButton>
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
}

export default DesignImageGrid;