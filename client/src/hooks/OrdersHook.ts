import {useMutation, useQueryClient, useQuery} from '@tanstack/react-query';
import {createOrder, deleteOrder, fetchOrders, updateOrder} from "../api/OrderssApi";
import {OrderJson} from "../model/KeynoyModels";

export const ORDER_QUERY_KEY = ['orders'] as const;

export const useGetOrdersHook = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });
};

export const useCreateOrderHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderJson: OrderJson) => createOrder(orderJson),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY }),
    });
};

export const useUpdateOrderHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderJson: OrderJson) => updateOrder(orderJson),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY }),
    });
};

export const useDeleteOrderHook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderJson: OrderJson) => deleteOrder(orderJson),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY }),
    });
};
