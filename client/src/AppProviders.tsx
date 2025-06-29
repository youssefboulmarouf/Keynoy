import React from "react";
import { CompaniesDesignsProvider } from "./context/CompaniesDesignsContext";
import { CompaniesProvider } from "./context/CompaniesContext";
import { ProductTypesProvider } from "./context/ProductTypesContext";
import { ProductsProvider } from "./context/ProductsContext";
import { ProductVariationProvider } from "./context/ProductVariationContext";
import { ColorsProvider } from "./context/ColorsContext";
import { OrdersProvider } from "./context/OrdersContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <CompaniesDesignsProvider>
            <CompaniesProvider>
                <ProductTypesProvider>
                    <ProductsProvider>
                        <ProductVariationProvider>
                            <ColorsProvider>
                                <OrdersProvider>
                                    {children}
                                </OrdersProvider>
                            </ColorsProvider>
                        </ProductVariationProvider>
                    </ProductsProvider>
                </ProductTypesProvider>
            </CompaniesProvider>
        </CompaniesDesignsProvider>
    );
};

export default AppProviders;