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
                                <CompaniesProvider>
                                    <ProductTypesProvider>
                                        <ColorsProvider>
                                            <ProductsProvider>
                                                <Routes>
                                                    <Route path="/" element={<Dashboard />} />

                                                    <Route path="/ventes" element={<Orders type={OrderTypeEnum.SELL}/>} />
                                                    <Route path="/achats" element={<Orders type={OrderTypeEnum.BUY}/>} />

                                                    <Route path="/charges" element={<Expenses />} />

                                                    <Route path="/produits" element={<Products />} />
                                                    <Route path="/type-produits" element={<ProductTypes />} />

                                                    <Route path="/fournisseurs" element={<Companies type={CompanyTypeEnum.SHIPPERS}/>} />
                                                    <Route path="/clients" element={<Companies  type={CompanyTypeEnum.CUSTOMERS}/>} />
                                                    <Route path="/livreurs" element={<Companies  type={CompanyTypeEnum.SHIPPERS}/>} />
                                                </Routes>
                                            </ProductsProvider>
                                        </ColorsProvider>
                                    </ProductTypesProvider>
                                </CompaniesProvider>
                            </Box>
                        </Container>
                    </PageWrapper>
                </BrowserRouter>
            </MainWrapper>
        </ThemeProvider>
    );
};

export default App;
