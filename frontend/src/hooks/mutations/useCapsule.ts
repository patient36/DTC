import { useQuery } from '@tanstack/react-query';
import { getCapsuleById } from '@/services/capsulesServce';
import { Capsule } from '@/types/capsule';

export const useCapsule = (id: string) => {
    const {
        data: capsule,
        isLoading: capsuleLoading,
        isError: capsuleError,
        error: capsuleErrorDetail
    } = useQuery<Capsule>({
        queryKey: ['capsule', id],
        queryFn: () => getCapsuleById(id),
        retry: false,
    })

    return {
        capsule,
        capsuleLoading,
        capsuleError,
        capsuleErrorDetail,
    };
};