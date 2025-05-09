import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Container, CssBaseline, styled} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {ThemeSettings} from "./theme/Theme";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Box from "@mui/material/Box";
import Dashboard from "./components/dashboard/Dashboard";
import Companies from "./components/companies/Companies";
import Expenses from "./components/expenses/Expenses";
import Orders from "./components/orders/Orders";
import ProductTypes from "./components/product-types/ProductTypes";
import Products from "./components/products/Products";
import {CompanyTypeEnum, OrderTypeEnum} from "./model/KeynoyModels";
import {ProductTypesProvider} from "./context/ProductTypesContext";
import {ProductsProvider} from "./context/ProductsContext";
import {ColorsProvider} from "./context/ColorsContext";
import {CompaniesProvider} from "./context/CompaniesContext";
import ProductVariations from "./components/product-variation/ProductVariations";
import {ProductVariationProvider} from "./context/ProductVariationContext";
import {CompaniesDesignsProvider} from "./context/CompaniesDesignsContext";
import CompanyDesign from "./components/company-design/CompanyDesign";

const PageWrapper = styled("div")(() => ({
    display: "flex",
    flexGrow: 1,
    paddingBottom: "60px",
    flexDirection: "column",
    zIndex: 1,
    width: "100%",
    backgroundColor: "transparent",
}));

const MainWrapper = styled("div")(() => ({
    display: "flex",
    minHeight: "100vh",
    width: "100%",
}));

const App: React.FC = () => {
    const theme = ThemeSettings();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MainWrapper>
                <BrowserRouter>
                    <Sidebar />
                    <PageWrapper className="page-wrapper">
                        <Header />
                        <Container sx={{maxWidth: "100%!important",}}>
                            <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
                                <CompaniesDesignsProvider>
                                    <CompaniesProvider>
                                        <ProductTypesProvider>
                                            <ProductsProvider>
                                                <ProductVariationProvider>
                                                    <ColorsProvider>
                                                        <Routes>
                                                            <Route path="/" element={<Dashboard />} />

                                                            <Route path="/ventes" element={<Orders orderType={OrderTypeEnum.SELL}/>} />
                                                            <Route path="/achats" element={<Orders orderType={OrderTypeEnum.BUY}/>} />

                                                            <Route path="/charges" element={<Expenses />} />

                                                            <Route path="/type-produits" element={<ProductTypes />} />
                                                            <Route path="/produits" element={<Products />} />
                                                            <Route path="/variations" element={<ProductVariations />} />

                                                            <Route path="/clients" element={<Companies  companyType={CompanyTypeEnum.CUSTOMERS}/>} />
                                                            <Route path="/designs" element={<CompanyDesign />} />

                                                            <Route path="/fournisseurs" element={<Companies companyType={CompanyTypeEnum.SUPPLIERS}/>} />
                                                            <Route path="/livreurs" element={<Companies  companyType={CompanyTypeEnum.SHIPPERS}/>} />
                                                        </Routes>
                                                    </ColorsProvider>
                                                </ProductVariationProvider>
                                            </ProductsProvider>
                                        </ProductTypesProvider>
                                    </CompaniesProvider>
                                </CompaniesDesignsProvider>
                            </Box>
                        </Container>
                    </PageWrapper>
                </BrowserRouter>
            </MainWrapper>
        </ThemeProvider>
    );
};

export default App;
