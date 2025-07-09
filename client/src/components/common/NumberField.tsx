import {TextField} from "@mui/material";
import React from "react";

interface NumberFieldProps {
    value: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    error?: boolean;
}

const NumberField: React.FC<NumberFieldProps> = ({
    value,
    onChange = () => {},
    disabled = false,
    error = false
}) => {
    return (
        <TextField
            fullWidth
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            disabled={disabled}
            error={error}
            sx={{
                mb: 2,
                '& input[type=number]': {
                    MozAppearance: 'textfield', // Firefox
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                },
            }}
        />
    );
}

export default NumberField;