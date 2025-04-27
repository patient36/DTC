import { useQuery } from '@tanstack/react-query';
import { getCapsules } from '@/services/capsulesServce';
import { CapsulesResponse } from '@/types/capsule';

export const useCapsules = (page: number, limit: number) => {
    const {
        data: capsulesData,
        isLoading: capsulesLoading,
        isError: capsulesError,
        error: capsulesErrorDetail
    } = useQuery<CapsulesResponse, Error>({
        queryKey: ['capsules', page, limit],
        queryFn: () => getCapsules(page, limit),
        retry: false,
    });

    return {
        capsulesData,
        capsulesLoading,
        capsulesError,
        capsulesErrorDetail,
    };
};