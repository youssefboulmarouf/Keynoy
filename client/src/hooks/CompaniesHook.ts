import {useQuery} from '@tanstack/react-query';
import {fetchCompanies} from "../api/CompaniesApi";

export const useGetCompaniesHook = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    });
};
