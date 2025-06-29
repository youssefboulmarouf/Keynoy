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
import SellOrders from "./components/orders/sell-orders/SellOrders";
import ProductTypes from "./components/product-types/ProductTypes";
import Products from "./components/products/Products";
import {CompanyTypeEnum, OrderTypeEnum} from "./model/KeynoyModels";
import ProductVariations from "./components/product-variation/ProductVariations";
import CompanyDesign from "./components/company-design/CompanyDesign";
import BuyOrders from "./components/orders/buy-orders/BuyOrders";
import Shipping from "./components/shipping/Shipping";
import AppProviders from "./AppProviders";

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
                                <AppProviders>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />

                                        <Route path="/ventes" element={<SellOrders/>} />
                                        <Route path="/achats" element={<BuyOrders/>} />

                                        <Route path="/charges" element={<Expenses />} />

                                        <Route path="/livraison" element={<Shipping />} />

                                        <Route path="/type-produits" element={<ProductTypes />} />
                                        <Route path="/produits" element={<Products />} />
                                        <Route path="/variations" element={<ProductVariations />} />

                                        <Route path="/clients" element={<Companies  companyType={CompanyTypeEnum.CUSTOMERS}/>} />
                                        <Route path="/designs" element={<CompanyDesign />} />

                                        <Route path="/fournisseurs" element={<Companies companyType={CompanyTypeEnum.SUPPLIERS}/>} />
                                        <Route path="/livreurs" element={<Companies  companyType={CompanyTypeEnum.SHIPPERS}/>} />
                                    </Routes>
                                </AppProviders>
                            </Box>
                        </Container>
                    </PageWrapper>
                </BrowserRouter>
            </MainWrapper>
        </ThemeProvider>
    );
};

export default App;
