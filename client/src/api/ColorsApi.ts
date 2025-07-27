import {ColorJson} from "../model/KeynoyModels";

export const fetchColors = async (): Promise<ColorJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/colors`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch colors');
    }
    return res.json();
}

export const createColor = async (colorJson: ColorJson) => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colorJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create color');
    }
    return res.json();
}

export const updateColor = async (colorJson: ColorJson) => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/colors/${colorJson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colorJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update color');
    }
    return res.json();
}

export const deleteColor = async (colorJson: ColorJson) => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/colors/${colorJson.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete color');
    }
}