import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, deleteUser } from '@/services/userService';

export const useUser = () => {
    const queryClient = useQueryClient();

    const updateUserMutation = useMutation({
        mutationFn: (variables: {
            updates: Partial<{
                name: string;
                email: string;
                oldPassword: string;
                newPassword: string
            }>,
            id: string
        }) => updateUser(variables.updates, variables.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (variables: { id: string, password: string }) =>
            deleteUser(variables.id, variables.password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
    });

    return {
        updateUser: updateUserMutation.mutate,
        updateUserAsync: updateUserMutation.mutateAsync,
        isUpdating: updateUserMutation.isPending,
        updateError: updateUserMutation.error,

        deleteUser: deleteUserMutation.mutate,
        deleteUserAsync: deleteUserMutation.mutateAsync,
        isDeleting: deleteUserMutation.isPending,
        deleteError: deleteUserMutation.error,
    };
};