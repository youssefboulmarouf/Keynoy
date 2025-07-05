import React from "react";
import { CompaniesDesignsProvider } from "./context/CompaniesDesignsContext";
import { CompaniesProvider } from "./context/CompaniesContext";
import { ProductTypesProvider } from "./context/ProductTypesContext";
import { ProductsProvider } from "./context/ProductsContext";
import { ProductVariationProvider } from "./context/ProductVariationContext";
import { ColorsProvider } from "./context/ColorsContext";
import { OrdersProvider } from "./context/OrdersContext";
import {ShippingProvider} from "./context/ShippingContext";
import {ExpensesProvider} from "./context/ExpensesContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <CompaniesDesignsProvider>
            <CompaniesProvider>
                <ProductTypesProvider>
                    <ProductsProvider>
                        <ProductVariationProvider>
                            <ColorsProvider>
                                <ExpensesProvider>
                                    <OrdersProvider>
                                        <ShippingProvider>
                                            {children}
                                        </ShippingProvider>
                                    </OrdersProvider>
                                </ExpensesProvider>
                            </ColorsProvider>
                        </ProductVariationProvider>
                    </ProductsProvider>
                </ProductTypesProvider>
            </CompaniesProvider>
        </CompaniesDesignsProvider>
    );
};

export default AppProviders;