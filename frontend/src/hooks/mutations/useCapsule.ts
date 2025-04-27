import { useQuery } from '@tanstack/react-query';
import { getCapsule } from '@/services/capsulesServce';
import { Capsule } from '@/types/capsule';

export const useCapsule = (id: string) => {
    const {
        data: capsule,
        isLoading: capsuleLoading,
        isError: capsuleError,
        error: capsuleErrorDetail
    } = useQuery<Capsule>({
        queryKey: ['capsule', id],
        queryFn: () => getCapsule(id),
        retry: false,
    })

    return {
        capsule,
        capsuleLoading,
        capsuleError,
        capsuleErrorDetail,
    };
};