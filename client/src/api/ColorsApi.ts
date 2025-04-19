import {ColorJson} from "../model/KeynoyModels";

export const fetchColors = async (): Promise<ColorJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/colors`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch colors');
    }
    return res.json();
}