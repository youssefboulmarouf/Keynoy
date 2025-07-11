import React, {useState} from "react";
import {Card, CardContent} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../../common/TableSearch";
import TableCallToActionButton from "../../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import ColorsList from "./ColorsList";

const ColorComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    return (
        <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
            <CardContent>
                <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <TableCallToActionButton
                        fullwidth={false}
                        callToActionText={`Ajouter Couleur`}
                        callToActionFunction={() => {}}
                    />
                </Stack>
                <Box sx={{ overflowX: "auto" }} mt={3}>
                    <ColorsList colors={[]} openColorDialogWithType={() => {}}/>
                </Box>
            </CardContent>
        </Card>
    );
}

export default ColorComponent;