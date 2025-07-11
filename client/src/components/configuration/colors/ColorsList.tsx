import React from "react";
import {usePaginationController} from "../../common/usePaginationController";
import {ColorJson, ModalTypeEnum} from "../../../model/KeynoyModels";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import EditButton from "../../common/buttons/EditButton";
import DeleteButton from "../../common/buttons/DeleteButton";
import Pagination from "../../common/Pagination";
import ColorBox from "../../common/ColorBox";

interface ColorsListProps {
    colors: ColorJson[];
    openColorDialogWithType: (type: ModalTypeEnum, color: ColorJson) => void;
}

const ColorsList: React.FC<ColorsListProps> = ({colors, openColorDialogWithType}) => {
    const paginationController = usePaginationController<ColorJson>(colors);
    if (colors.length === 0) return <Typography>Aucun Couleur trouver</Typography>;
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Nom Couleur</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Code Html</Typography></TableCell>
                    <TableCell><Typography variant="h6" fontSize="14px">Couleur</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginationController.data.map((color) => (
                    <TableRow key={color.id}>
                        <TableCell>{color.id}</TableCell>
                        <TableCell>{color.name}</TableCell>
                        <TableCell>{'#' + color.htmlCode}</TableCell>
                        <TableCell>
                            <ColorBox htmlCode={color.htmlCode}/>
                        </TableCell>
                        <TableCell align="right">
                            <EditButton
                                tooltipText={`Modifier Ville`}
                                openDialogWithType={() => openColorDialogWithType(ModalTypeEnum.UPDATE, color)}
                            />
                            <DeleteButton
                                tooltipText={`Supprimer  Ville`}
                                openDialogWithType={() => openColorDialogWithType(ModalTypeEnum.DELETE, color)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Pagination paginationController={paginationController}/>
        </Table>
    );
}

export default ColorsList;