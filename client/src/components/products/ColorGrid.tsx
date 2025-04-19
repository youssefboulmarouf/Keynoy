import {ColorJson} from "../../model/KeynoyModels";
import {useColorContext} from "../../context/ColorsContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Table, TableCell, TableRow} from "@mui/material";

interface ColorGridProps {
    productColors: ColorJson[];
    onChange: (colors: ColorJson[]) => void;
    disabled?: boolean;
}

const ColorGrid: React.FC<ColorGridProps> = ({ productColors, onChange, disabled = false }) => {
    const { colors } = useColorContext();

    const handleToggleColor = (color: ColorJson) => {
        if (productColors.map(value => value.id).includes(color.id)) {
            onChange(productColors.filter((c) => c.id !== color.id));
        } else {
            onChange([...productColors, color]);
        }
    };

    const selectedColors = colors.filter((color) => productColors.map(value => value.id).includes(color.id));
    const unselectedColors = colors.filter((color) => !productColors.map(value => value.id).includes(color.id));

    const renderColorBox = (color: ColorJson) => (
        <Box
            key={color.id}
            onClick={() => !disabled && handleToggleColor(color)}
            sx={{
                width: 30,
                height: 30,
                borderRadius: '6px',
                backgroundColor: '#' + color.htmlCode,
                border: '1px solid #ccc',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
            }}
            title={color.name}
        />
    );

    return (
        <Box sx={{ mt: 1 }}>
            <Table>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Selection</Typography>
                    </TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {selectedColors.map((color) => renderColorBox(color))}
                        </Box>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Disponible</Typography>
                    </TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {unselectedColors.map((color) => renderColorBox(color))}
                        </Box>
                    </TableCell>
                </TableRow>
            </Table>
        </Box>
    );
}

export default ColorGrid;