import {CompanyJson} from "../model/KeynoyModels";

export const fetchCompanies = async (): Promise<CompanyJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch product types');
    }
    return res.json();
};

export const createCompany = async (company: CompanyJson): Promise<CompanyJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create product type');
    }
    return res.json();
};

export const updateCompany = async (company: CompanyJson): Promise<CompanyJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies/${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product type');
    }
    return res.json();
};

export const deleteCompany = async (company: CompanyJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/companies/${company.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update product type');
    }
    return res.json();
};
