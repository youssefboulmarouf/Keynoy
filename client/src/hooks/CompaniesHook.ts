import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query';
import {CompanyJson} from "../model/KeynoyModels";
import {createCompany, deleteCompany, fetchCompanies, updateCompany} from "../api/CompaniesApi";

export const COMPANY_QUERY_KEY = ['companies'] as const;

export const useGetCompaniesHook = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    });
};

export const useCreateCompanyHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (company: CompanyJson) => createCompany(company),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY }),
    });
};

export const useUpdateCompanyHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (company: CompanyJson) => updateCompany(company),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY }),
    });
};

export const useDeleteCompanyHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (company: CompanyJson) => deleteCompany(company),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY }),
    });
};
