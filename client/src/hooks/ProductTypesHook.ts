import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query';
import {createProductType, updateProductType, fetchProductTypes, deleteProductType} from "../api/ProductTypesApi";
import {ProductTypeJson} from "../model/KeynoyModels";

export const PRODUCT_TYPES_QUERY_KEY = ['product-types'] as const;

export const useGetProductTypesHook = () => {
    return useQuery({
        queryKey: ['product-types'],
        queryFn: fetchProductTypes,
    });
};

export const useCreateProductType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productType: ProductTypeJson) => createProductType(productType),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY }),
    });
};

export const useUpdateProductType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productType: ProductTypeJson) => updateProductType(productType),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY }),
    });
};

export const useDeleteProductType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productType: ProductTypeJson) => deleteProductType(productType),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_TYPES_QUERY_KEY }),
    });
};
