import React from "react";
import {usePaginationController} from "../../common/usePaginationController";
import {CityJson, ModalTypeEnum} from "../../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import EditButton from "../../common/buttons/EditButton";
import DeleteButton from "../../common/buttons/DeleteButton";
import Pagination from "../../common/Pagination";

interface CitiesListProps {
    cities: CityJson[];
    openCityDialogWithType: (type: ModalTypeEnum, coty: CityJson) => void;
}

const CitiesList: React.FC<CitiesListProps> = ({cities, openCityDialogWithType}) => {
    const paginationController = usePaginationController<CityJson>(cities);
    if (cities.length === 0) return <Typography>Aucune Ville trouver</Typography>;
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Ville</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginationController.data.map((city) => (
                    <TableRow key={city.id}>
                        <TableCell>{city.id}</TableCell>
                        <TableCell>{city.name}</TableCell>
                        <TableCell align="right">
                            <EditButton
                                tooltipText={`Modifier Ville`}
                                openDialogWithType={() => openCityDialogWithType(ModalTypeEnum.UPDATE, city)}
                            />
                            <DeleteButton
                                tooltipText={`Supprimer  Ville`}
                                openDialogWithType={() => openCityDialogWithType(ModalTypeEnum.DELETE, city)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Pagination paginationController={paginationController}/>
        </Table>
    );
}

export default CitiesList;