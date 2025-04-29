import {CompanyDesignJson} from "../model/KeynoyModels";

export const fetchCompaniesDesigns = async (): Promise<CompanyDesignJson[]> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/company-design`);
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to fetch companies designs');
    }
    return res.json();
}

export const createCompanyDesign = async (companyDesign: CompanyDesignJson): Promise<CompanyDesignJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/company-design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyDesign),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to create company design');
    }
    return res.json();
};

export const updateCompanyDesign = async (companyDesign: CompanyDesignJson): Promise<CompanyDesignJson> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/company-design/${companyDesign.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyDesign),
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to update company design');
    }
    return res.json();
};

export const deleteCompanyDesign = async (companyDesign: CompanyDesignJson): Promise<void> => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/company-design/${companyDesign.id}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete company design');
    }
};