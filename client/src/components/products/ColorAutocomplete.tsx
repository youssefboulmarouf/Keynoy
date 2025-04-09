import { Autocomplete, TextField, Box, Stack, Typography } from "@mui/material";
import { ColorEnum } from "../../model/KeynoyModels";

const colorOptions = Object.values(ColorEnum);

type Props = {
    value: ColorEnum;
    onChange: (value: ColorEnum) => void;
    label?: string;
    disabled?: boolean;
};

const ColorAutocomplete: React.FC<Props> = ({ value, onChange, label = "Color", disabled = false }) => {
    return (
        <Autocomplete
            options={colorOptions}
            getOptionLabel={(option) => option}
            value={value}
            onChange={(event, newValue) => {
                if (newValue) onChange(newValue);
            }}
            renderInput={(params) => <TextField {...params} label={label} />}
            renderOption={(props, option) => (
                <li {...props}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                            sx={{
                                width: 25,
                                height: 25,
                                backgroundColor: option,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        />
                        <Typography variant="body2">{option}</Typography>
                    </Stack>
                </li>
            )}
            disabled={disabled}
        />
    );
};

export default ColorAutocomplete;
