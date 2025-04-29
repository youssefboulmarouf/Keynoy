import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {CompanyDesignJson} from "../model/KeynoyModels";
import {
    createCompanyDesign,
    deleteCompanyDesign,
    fetchCompaniesDesigns,
    updateCompanyDesign
} from "../api/CompanyDesignsApi";

interface CompaniesDesignsContextValue {
    designs: CompanyDesignJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addDesign: (design: CompanyDesignJson) => Promise<void>;
    editDesign: (design: CompanyDesignJson) => Promise<void>;
    removeDesign: (design: CompanyDesignJson) => Promise<void>;
}

const CompaniesDesignsContext = createContext<CompaniesDesignsContextValue | undefined>(undefined)

export const useCompaniesDesignsContext = (): CompaniesDesignsContextValue => {
    const context = useContext(CompaniesDesignsContext);
    if (!context) {
        throw new Error("useCompaniesDesignsContext must be used within a CompaniesDesignsProvider");
    }
    return context;
}

export const CompaniesDesignsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [designs, setDesigns] = useState<CompanyDesignJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addDesign = async (design: CompanyDesignJson) => {
        await createCompanyDesign(design);
        await refresh();
    }

    const editDesign = async (design: CompanyDesignJson) => {
        await updateCompanyDesign(design);
        await refresh();
    }

    const removeDesign = async (design: CompanyDesignJson) => {
        await deleteCompanyDesign(design);
        await refresh();
    }

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCompaniesDesigns();
            setDesigns(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const value: CompaniesDesignsContextValue = useMemo(() => ({
        designs,
        loading,
        error,
        refresh,
        addDesign,
        editDesign,
        removeDesign,
    }), [designs, loading, error]);

    return <CompaniesDesignsContext.Provider value={value}>{children}</CompaniesDesignsContext.Provider>;
}