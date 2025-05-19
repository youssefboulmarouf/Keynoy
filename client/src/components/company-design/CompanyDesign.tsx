import React, {useMemo, useState} from "react";
import Breadcrumb from "../common/Breadcrumb";
import {Card, CardContent, Grid, Stack} from "@mui/material";
import TableCallToActionButton from "../common/TableCallToActionButton";
import {useCompaniesDesignsContext} from "../../context/CompaniesDesignsContext";
import Box from "@mui/material/Box";
import CompanyDesignList from "./CompanyDesignList";
import {useCompaniesContext} from "../../context/CompaniesContext";
import {CompanyDesignJson, CompanyJson, CompanyTypeEnum, ModalTypeEnum} from "../../model/KeynoyModels";
import CompanyDesignDialog from "./CompanyDesignDialog";
import {useDialogController} from "../common/useDialogController";
import CompanyDesignFilters from "./CompanyDesignFilter";

interface FilterProps {
    searchTerm: string;
    company: CompanyJson | null;
}

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
    const [filters, setFilters] = useState<FilterProps>({searchTerm: "", company: null});
    const {companies} = useCompaniesContext()
    const {designs, addDesign, editDesign, removeDesign} = useCompaniesDesignsContext();
    const companyDesignDialog = useDialogController<CompanyDesignJson>({id: 0, designName: "", designImages: [], companyId: 0})

    const filteredDesigns = useMemo(() => {
        return designs.filter(design => {
            const searchTerm = filters.searchTerm.toLowerCase();
            const designName = design.designName.toLowerCase();
            const companyName = companies.find(c => c.id === design.companyId)?.name.toLowerCase() ?? "";
            const companyPhone = companies.find(c => c.id === design.companyId)?.phone ?? "";

            const designNameMatchSearch = searchTerm ? designName.includes(searchTerm.toLowerCase()) : true;
            const companyPhoneMatchSearch = searchTerm ? companyPhone.includes(searchTerm) : true;
            const companyNameMatchSearch = searchTerm ? companyName.includes(searchTerm.toLowerCase()) : true;
            const designIsPartOfCompany = filters.company ? design.companyId === filters.company.id : true;

            return (designNameMatchSearch || companyPhoneMatchSearch || companyNameMatchSearch) && designIsPartOfCompany;
        }) || [];
    }, [filters, designs, companies])

    return (
        <>
            <Breadcrumb title="Design Clients" items={bCrumb} />
            <Grid container mt={3}>
                <Card sx={{padding: 0, borderColor: (theme) => theme.palette.divider}} variant="outlined">
                    <CardContent>
                        <Stack justifyContent="space-between" direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                            <CompanyDesignFilters
                                filters={filters}
                                setFilters={setFilters}
                                companies={companies.filter(c => c.companyType === CompanyTypeEnum.CUSTOMERS)}
                            />
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
                                companyDesigns={filteredDesigns}
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