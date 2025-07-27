import {ColorJson} from "../model/KeynoyModels";
import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {createColor, deleteColor, fetchColors, updateColor} from "../api/ColorsApi";

interface ColorContextValue {
    colors: ColorJson[];
    loading: boolean;
    error: Error | null;
    refresh: () => void;
    addColor: (colorJson: ColorJson) => Promise<void>;
    editColor: (colorJson: ColorJson) => Promise<void>;
    removeColor: (colorJson: ColorJson) => Promise<void>;
}

const ColorsContext = createContext<ColorContextValue | undefined>(undefined);

export const useColorContext = (): ColorContextValue => {
    const context = useContext(ColorsContext);
    if (!context) {
        throw new Error("useColorContext must be used within a ColorsProvider");
    }
    return context;
};

export const ColorsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [colors, setColors] = useState<ColorJson[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const addColor = async (colorJson: ColorJson) => {
        await createColor(colorJson);
        await refresh();
    }

    const editColor = async (colorJson: ColorJson) => {
        await updateColor(colorJson);
        await refresh();
    }

    const removeColor = async (colorJson: ColorJson) => {
        await deleteColor(colorJson);
        await refresh();
    }

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchColors();
            setColors(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);
    
    const value: ColorContextValue = useMemo(() => ({
        colors,
        loading,
        error,
        refresh,
        addColor,
        editColor,
        removeColor,
    }), [colors, loading, error])

    return (
        <ColorsContext.Provider value={value}>{children}</ColorsContext.Provider>
    )
}