import {CompanyDesignJson} from "../model/KeynoyModels";

export const fetchDesigns = async (companyId: number): Promise<CompanyDesignJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies/${companyId}/designs`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch company designs');
    }
    return res.json();
};

export const createDesign = async (design: CompanyDesignJson, companyId: number): Promise<CompanyDesignJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies/${companyId}/designs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create company design');
    }
    return res.json();
};

export const updateDesign = async (design: CompanyDesignJson, companyId: number): Promise<CompanyDesignJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies/${companyId}/designs/${design.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product type');
    }
    return res.json();
};

export const deleteDesign = async (design: CompanyDesignJson, companyId: number): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies/${companyId}/designs/${design.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product type');
    }
};
