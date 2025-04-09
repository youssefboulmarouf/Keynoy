import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query';
import {ProductJson} from "../model/KeynoyModels";
import {createProduct, deleteProduct, fetchProducts, updateProduct} from "../api/ProductsApi";

export const PRODUCT_QUERY_KEY = ['products'] as const;

export const useGetProductsHook = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });
};

export const useCreateProductHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: ProductJson) => createProduct(product),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY }),
    });
};

export const useUpdateProductHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: ProductJson) => updateProduct(product),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY }),
    });
};

export const useDeleteProductHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: ProductJson) => deleteProduct(product),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY }),
    });
};
