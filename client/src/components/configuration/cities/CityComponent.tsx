import React, {useMemo, useState} from "react";
import {Card, CardContent} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../../common/TableSearch";
import TableCallToActionButton from "../../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import CitiesList from "./CitiesList";
import {useDialogController} from "../../common/useDialogController";
import {CityJson, ModalTypeEnum} from "../../../model/KeynoyModels";
import {useCityContext} from "../../../context/CitiesContext";
import CityDialog from "./CityDialog";

const emptyCity: CityJson = {
    id: 0,
    name: "",
}

const CityComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const cityDialog = useDialogController<CityJson>(emptyCity)
    const {cities, addCity, removeCity, editCity} = useCityContext();

    const filteredCities = useMemo(() => {
        return cities.filter(c => {
            return searchTerm ? c.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        }) || [];
    }, [searchTerm, cities]);

    return (
        <>
            <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                <CardContent>
                    <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                        <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <TableCallToActionButton
                            fullwidth={false}
                            callToActionText={`Ajouter Ville`}
                            callToActionFunction={() => cityDialog.openDialog(ModalTypeEnum.ADD, emptyCity)}
                        />
                    </Stack>
                    <Box sx={{ overflowX: "auto" }} mt={3}>
                        <CitiesList cities={filteredCities} openCityDialogWithType={cityDialog.openDialog}/>
                    </Box>
                </CardContent>
            </Card>
           <CityDialog
               selectedCity={cityDialog.data}
               dialogType={cityDialog.type}
               openDialog={cityDialog.open}
               closeDialog={cityDialog.closeDialog}
               addCity={addCity}
               editCity={editCity}
               removeCity={removeCity}
           />
        </>
    );
}

export default CityComponent;