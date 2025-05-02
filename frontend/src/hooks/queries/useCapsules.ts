import { useQuery } from '@tanstack/react-query';
import { getCapsules } from '@/services/capsulesService';
import { CapsulesResponse } from '@/types/capsule';

export const useCapsules = (page = 1, limit = 10) => {
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