import {CompanyDesignJson} from "../../model/KeynoyModels";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import {ThemeSettings} from "../../theme/Theme";

interface CompanyDesignGridProps {
    companyDesign: CompanyDesignJson[];
    orderDesign: CompanyDesignJson | null;
    onChangeOrderDesign: (companyDesigns: CompanyDesignJson) => void;
    disabled?: boolean;
}

const OrderDesignGrid: React.FC<CompanyDesignGridProps> = ({companyDesign, orderDesign, onChangeOrderDesign, disabled}) => {
    const theme = ThemeSettings();

    return (
        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
            {/*{companyDesign.map((design) => {*/}
            {/*    const isSelected = orderDesign?.id === design.id;*/}

            {/*    return (*/}
            {/*        <Box*/}
            {/*            key={design.id}*/}
            {/*            onClick={() => onChangeOrderDesign(design)}*/}
            {/*            sx={{*/}
            {/*                width: 140,*/}
            {/*                textAlign: "center",*/}
            {/*                cursor: disabled ? "not-allowed" : "pointer",*/}
            {/*                border: isSelected ? "3px solid primary" : "1px solid #ccc",*/}
            {/*                borderRadius: 2,*/}
            {/*                padding: 1,*/}
            {/*                backgroundColor: isSelected ? theme.palette.primary.dark : "transparent",*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <img*/}
            {/*                src={design.designUrl}*/}
            {/*                style={{ width: "100%", height: 150, borderRadius: 8, border: "1px solid #ccc" }}*/}
            {/*            />*/}
            {/*            <Typography variant="caption" display="block" mt={1}>*/}
            {/*                {design.designName}*/}
            {/*            </Typography>*/}
            {/*        </Box>*/}
            {/*    );*/}
            {/*})}*/}
        </Box>
    );
}

export default OrderDesignGrid;