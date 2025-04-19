import {CompanyJson} from "../model/KeynoyModels";
import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {createCompany, deleteCompany, fetchCompanies, updateCompany} from "../api/CompaniesApi";

interface CompaniesContextValue {
    companies: CompanyJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addCompany: (company: CompanyJson) => Promise<void>;
    editCompany: (company: CompanyJson) => Promise<void>;
    removeCompany: (company: CompanyJson) => Promise<void>;
}

const CompaniesContext = createContext<CompaniesContextValue | undefined>(undefined);

export const useCompaniesContext = (): CompaniesContextValue => {
    const context = useContext(CompaniesContext);
    if (!context) {
        throw new Error("useCompaniesContext must be used within a CompaniesProvider");
    }
    return context;
}

export const CompaniesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [companies, setCompanies] =  useState<CompanyJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addCompany = async (company: CompanyJson) => {
        await createCompany(company);
        await refresh();
    };

    const editCompany = async (company: CompanyJson) => {
        await updateCompany(company);
        await refresh();
    };

    const removeCompany = async (company: CompanyJson) => {
        await deleteCompany(company);
        await refresh();
    };

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCompanies();
            setCompanies(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const value: CompaniesContextValue = useMemo(() => ({
        companies,
        loading,
        error,
        refresh,
        addCompany,
        editCompany,
        removeCompany,
    }), [companies, loading, error]);

    return <CompaniesContext.Provider value={value}>{children}</CompaniesContext.Provider>;
}