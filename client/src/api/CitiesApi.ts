import {CityJson} from "../model/KeynoyModels";

export const fetchCities = async (): Promise<CityJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cities`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch cities');
    }
    return res.json();
}

export const createCity = async (cityJson: CityJson) => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create city');
    }
    return res.json();
}

export const updateCity = async (cityJson: CityJson) => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cities/${cityJson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityJson),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update city');
    }
    return res.json();
}

export const deleteCity = async (cityJson: CityJson) => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cities/${cityJson.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete city');
    }
}