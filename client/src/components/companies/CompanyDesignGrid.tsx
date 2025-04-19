import {CompanyDesignJson} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";
import React from "react";

interface CompanyDesignGridProps {
    companyDesign: CompanyDesignJson[];
    onChangeCompanyDesign: (companyDesigns: CompanyDesignJson[]) => void;
    disabled?: boolean;
}

const CompanyDesignGrid: React.FC<CompanyDesignGridProps> = ({companyDesign, onChangeCompanyDesign, disabled}) => {
    const handleRemoveDesign = (design: CompanyDesignJson) => {
        onChangeCompanyDesign(companyDesign.filter(d => d.designUrl !== design.designUrl));
    }

    return (
        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
            {companyDesign.map((design) => {
                return (
                    <Box key={design.id} sx={{ width: 120, textAlign: "center" }}>
                        <img
                            src={design.designUrl}
                            style={{ width: "100%", height: 150, borderRadius: 8, border: "1px solid #ccc" }}
                        />
                        <Stack direction={{ xs: "column", sm: "row" }}>
                            <IconButton
                                color="error"
                                onClick={() => handleRemoveDesign(design)}
                            >
                                <ClearIcon width={22} />
                            </IconButton>
                            <Typography variant="caption" display="block" mt={1}>
                                {design.designName}
                            </Typography>
                        </Stack>
                    </Box>
                );
            })}
        </Box>
    );
}

export default CompanyDesignGrid;