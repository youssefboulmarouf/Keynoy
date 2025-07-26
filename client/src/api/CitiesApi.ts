import {CityJson} from "../model/KeynoyModels";

export const fetchCities = async (): Promise<CityJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cities`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch cities');
    }
    return res.json();
}