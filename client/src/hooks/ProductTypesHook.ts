import {useQuery} from '@tanstack/react-query';
import {fetchProductTypes} from "../api/ProductTypesApi";

export const useGetProductTypesHook = () => {
    return useQuery({
        queryKey: ['product-types'],
        queryFn: fetchProductTypes,
    });
};

