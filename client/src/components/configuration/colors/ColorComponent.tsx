import React, {useMemo, useState} from "react";
import {Card, CardContent} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../../common/TableSearch";
import TableCallToActionButton from "../../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import ColorsList from "./ColorsList";
import {ColorJson, ModalTypeEnum} from "../../../model/KeynoyModels";
import {useDialogController} from "../../common/useDialogController";
import {useColorContext} from "../../../context/ColorsContext";
import ColorDialog from "./ColorDialog";

const emptyColor: ColorJson = {
    id: 0,
    name: "",
    htmlCode: ""
}

const ColorComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const colorDialog = useDialogController<ColorJson>(emptyColor);
    const {colors, addColor, editColor, removeColor} = useColorContext();

    const filteredColor = useMemo(() => {
        return colors.filter(c => {
            const colorNameMatchSearch = searchTerm ? c.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            const colorHtmlCodeMatchSearch = searchTerm ? c.htmlCode.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            return colorNameMatchSearch || colorHtmlCodeMatchSearch;
        }) || [];
    }, [searchTerm, colors]);

    return (
        <>
            <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                <CardContent>
                    <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <TableCallToActionButton
                            fullwidth={false}
                            callToActionText={`Ajouter Couleur`}
                            callToActionFunction={() => colorDialog.openDialog(ModalTypeEnum.ADD, emptyColor)}
                        />
                    </Stack>
                    <Box sx={{ overflowX: "auto" }} mt={3}>
                        <ColorsList colors={filteredColor} openColorDialogWithType={colorDialog.openDialog}/>
                    </Box>
                </CardContent>
            </Card>
            <ColorDialog
                selectedColor={colorDialog.data}
                dialogType={colorDialog.type}
                openDialog={colorDialog.open}
                closeDialog={colorDialog.closeDialog}
                addColor={addColor}
                editColor={editColor}
                removeColor={removeColor}
            />
        </>

    );
}

export default ColorComponent;