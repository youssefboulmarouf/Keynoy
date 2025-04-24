import React, {useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid} from "@mui/material";
import {Stack} from "@mui/system";
import TableSearch from "../common/TableSearch";
import TableCallToActionButton from "../common/TableCallToActionButton";
import Box from "@mui/material/Box";
import CompanyDialog from "./CompanyDialog";
import {CompanyJson, ModalTypeEnum} from "../../model/KeynoyModels";
import CompaniesList from "./CompaniesList";
import {useCompaniesContext} from "../../context/CompaniesContext";
import {useDialogController} from "../common/useDialogController";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Partenaire",
    },
];

interface CompaniesProps {
    type: string;
}

const Companies: React.FC<CompaniesProps> = ({type}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const companyDialog = useDialogController<CompanyJson>({
        id: 0,
        name: "",
        companyType: "",
        phone: "",
        location: "",
        companyDesigns: []
    })
    const {companies, loading, error} = useCompaniesContext();

    const filteredCompanies = companies?.filter(c =>
        c.companyType === type && (
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

    return (
        <>
            <Breadcrumb title={type} items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <TableCallToActionButton
                                fullwidth={false}
                                callToActionText={`Ajouter ${type}`}
                                callToActionFunction={() => companyDialog.openDialog(
                                    ModalTypeEnum.ADD,
                                    {
                                        id: 0,
                                        name: "",
                                        companyType: "",
                                        phone: "",
                                        location: "",
                                        companyDesigns: []
                                    }
                                )}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <CompaniesList
                                loading={loading}
                                error={error}
                                companyType={type}
                                data={filteredCompanies}
                                handleOpenDialogType={companyDialog.openDialog}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <CompanyDialog
                concernedCompany={companyDialog.data}
                dialogType={companyDialog.type}
                companyType={type}
                openDialog={companyDialog.open}
                closeDialog={companyDialog.closeDialog}
            />
        </>
    );
};

export default Companies;
