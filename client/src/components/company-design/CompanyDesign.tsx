import React from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid, Stack} from "@mui/material";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {useCompaniesDesignsContext} from "../../context/CompaniesDesignsContext";
import Box from "@mui/material/Box";
import CompanyDesignList from "./CompanyDesignList";
import {useCompaniesContext} from "../../context/CompaniesContext";
import {CompanyDesignJson, CompanyTypeEnum, ModalTypeEnum} from "../../model/KeynoyModels";
import CompanyDesignDialog from "./CompanyDesignDialog";
import {useDialogController} from "../common/useDialogController";

const bCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Designs",
    },
];

const CompanyDesign: React.FC = () => {
    const {companies} = useCompaniesContext()
    const {designs, addDesign, editDesign, removeDesign} = useCompaniesDesignsContext();
    const companyDesignDialog = useDialogController<CompanyDesignJson>({id: 0, designName: "", designImages: [], companyId: 0})
    return (
        <>
            <Breadcrumb title="Design Clients" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <TableCallToActionButton
                                fullwidth={false}
                                callToActionText="Ajouter Design"
                                callToActionFunction={() => companyDesignDialog.openDialog(
                                    ModalTypeEnum.ADD,
                                    {id: 0, designName: "", designImages: [], companyId: 0}
                                )}
                            />
                        </Stack>
                        <Box sx={{ overflowX: "auto" }} mt={3}>
                            <CompanyDesignList
                                companyDesigns={designs}
                                companies={companies.filter(c => c.companyType === CompanyTypeEnum.CUSTOMERS)}
                                openCompanyDesignDialogWithType={companyDesignDialog.openDialog}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <CompanyDesignDialog
                selectedCompanyDesign={companyDesignDialog.data}
                companies={companies.filter(c => c.companyType === CompanyTypeEnum.CUSTOMERS)}
                dialogType={companyDesignDialog.type}
                openDialog={companyDesignDialog.open}
                closeDialog={companyDesignDialog.closeDialog}
                addDesign={addDesign}
                editDesign={editDesign}
                removeDesign={removeDesign}
            />
        </>
    );
}

export default CompanyDesign;