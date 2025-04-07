import React, {useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../common/TableSearch";
import TableCallToActionButton from "../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useGetProductTypesHook} from "../../hooks/ProductTypesHook";
import LoadingComponent from "../common/LoadingComponent";
import ProductTypeDialog from "./ProductTypeDialog";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Product Types",
    },
];

const ProductTypes: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<string>("");
    const { data, isLoading, isError } = useGetProductTypesHook();

    const handleOpenDialogType = (type: string) => {
        console.log("handleAddNewProductType");
        setDialogType(type);
        setOpenDialog(true);
    };

    const filteredProductTypes = data?.filter(pt =>
        pt.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    let listProductsTypes;

    if (isLoading) {
        listProductsTypes = <LoadingComponent message="Loading product types" />;
    } else if (isError) {
        listProductsTypes = <Typography color="error">Error loading product types</Typography>;
    } else if (filteredProductTypes.length === 0) {
        listProductsTypes = <Typography>No product types found</Typography>;
    } else {
        listProductsTypes = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6" fontSize="14px">Id</Typography></TableCell>
                        <TableCell><Typography variant="h6" fontSize="14px">Type Produits</Typography></TableCell>
                        <TableCell align="right"><Typography variant="h6" fontSize="14px">Actions</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredProductTypes.map((type) => (
                        <TableRow key={type.id}>
                            <TableCell>{type.id}</TableCell>
                            <TableCell>{type.name}</TableCell>
                            <TableCell align="right">
                                <Tooltip title="Modifier Type Produit">
                                    <IconButton
                                        color="warning"
                                        onClick={() => {handleOpenDialogType("Modifier")}}
                                    >
                                        <EditIcon width={22} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer Type Produit">
                                    <IconButton
                                        color="error"
                                        onClick={() => {handleOpenDialogType("Supprimer")}}
                                    >
                                        <DeleteIcon width={22} />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    return (
        <>
            <Breadcrumb title="Product Types" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <TableCallToActionButton
                                callToActionText="Ajouter Type Produit"
                                callToActionFunction={() => handleOpenDialogType("Ajouter")}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            {listProductsTypes}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <ProductTypeDialog closeDialog={() => setOpenDialog(false)} dialogType={dialogType} openDialog={openDialog} />
        </>
    );
};

export default ProductTypes;
