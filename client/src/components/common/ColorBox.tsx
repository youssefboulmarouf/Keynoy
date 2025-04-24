import {Box} from "@mui/material";
import React from "react";

interface ColorBoxProps {
    htmlCode: string
}

const ColorBox: React.FC<ColorBoxProps> = ({htmlCode}) => {
    return (
        <Box
            sx={{
                width: 25,
                height: 25,
                backgroundColor: "#" + htmlCode,
                border: "1px solid #ccc",
                borderRadius: "4px",
            }}
        />
    );
}

export default ColorBox;