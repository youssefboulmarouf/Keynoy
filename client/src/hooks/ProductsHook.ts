import {useQuery} from '@tanstack/react-query';
import {fetchProducts} from "../api/ProductsApi";

export const useGetProductsHook = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });
};
