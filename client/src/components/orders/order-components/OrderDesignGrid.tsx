import {CompanyDesignJson} from "../../../model/KeynoyModels";
import React from "react";
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@mui/material";

interface CompanyDesignGridProps {
    companyDesigns: CompanyDesignJson[];
    orderDesign: CompanyDesignJson | null;
    onChangeOrderDesign: (selectedDesign: CompanyDesignJson | null) => void;
    disabled?: boolean;
}

const OrderDesignGrid: React.FC<CompanyDesignGridProps> = ({ companyDesigns, orderDesign, onChangeOrderDesign, disabled = false }) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = Number(event.target.value);
        const selectedDesign = companyDesigns.find(design => design.id === selectedId);
        console.log("selectedDesign: ", selectedDesign);
        onChangeOrderDesign(selectedDesign ?? null);
    };

    return (
        <RadioGroup
            value={orderDesign?.id ?? ""}
            onChange={handleChange}
        >
            <Table>
                <TableBody>
                    {companyDesigns.map((design) => (
                        <TableRow key={design.id}>
                            <TableCell>
                                <FormControlLabel
                                    value={design.id}
                                    control={<Radio disabled={disabled} />}
                                    label={design.designName}
                                />
                            </TableCell>
                            <TableCell>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                                    {design.designImages.map(image => (
                                        <img
                                            key={image.id}
                                            src={image.imageUrl}
                                            style={{ width: 50, height: 50, borderRadius: 8, border: "1px solid #ccc" }}
                                        />
                                    ))}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </RadioGroup>
    );
};

export default OrderDesignGrid;