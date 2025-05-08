import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCapsuleById, deleteCapsule, createCapsule } from '@/services/capsulesService';
import { Capsule } from '@/types/capsule';

export const useCapsule = (id?: string) => {
    const queryClient = useQueryClient()
    const {
        data: capsule,
        isLoading: capsuleLoading,
        isError: capsuleError,
        error: capsuleErrorDetail
    } = useQuery<Capsule>({
        queryKey: ['capsule', id],
        queryFn: () => getCapsuleById(id!),
        enabled: !!id,
        retry: false,
    })

    const deleteCapsuleMutation = useMutation({
        mutationFn: (variables: { id: string }) =>
            deleteCapsule(variables.id),
        onSuccess: () => {
            if (id) {
                queryClient.invalidateQueries({ queryKey: ['capsule', id] });
            }
        },
    });

    const createCapsuleMutation = useMutation({
        mutationFn: createCapsule,
    })

    return {
        capsule,
        capsuleLoading,
        capsuleError,
        capsuleErrorDetail,

        deleteCapsule: deleteCapsuleMutation.mutate,
        isDeleting: deleteCapsuleMutation.isPending,
        deleteError: deleteCapsuleMutation.error,

        createCapsule: createCapsuleMutation.mutate,
        isCreating: createCapsuleMutation.isPending,
        creationError: createCapsuleMutation.isError,
        creationErrorDetail: createCapsuleMutation.error,
    };
};