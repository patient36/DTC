import { useQuery } from '@tanstack/react-query';
import { getPayments } from '@/services/userService';
import { PaymentsResponse } from '@/types/payment';

export const usePayment = (page: number, limit: number) => {
    const {
        data: paymentsData,
        isLoading: paymentsLoading,
        isError: paymentsError,
        error: paymentsErrorDetail
    } = useQuery<PaymentsResponse, Error>({
        queryKey: ['payments', 'user', page, limit],
        queryFn: () => getPayments(page, limit),
        retry: false,
    });

    return {
        paymentsData,
        paymentsLoading,
        paymentsError,
        paymentsErrorDetail,
    };
};