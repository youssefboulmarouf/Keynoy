import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {CityJson} from "../model/KeynoyModels";
import {fetchCities} from "../api/CitiesApi";

interface CitiesContextValue {
    cities: CityJson[];
    loading: boolean;
    error: Error | null;
}

const CitiesContext = createContext<CitiesContextValue | undefined>(undefined);

export const useCityContext = (): CitiesContextValue => {
    const context = useContext(CitiesContext);
    if (!context) {
        throw new Error("useCityContext must be used within a CitiesProvider");
    }
    return context;
};

export const CitiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cities, setCities] = useState<CityJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCities();
            setCities(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);
    
    const value: CitiesContextValue = useMemo(() => ({
        cities,
        loading,
        error
    }), [cities, loading, error])

    return (
        <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
    )
}