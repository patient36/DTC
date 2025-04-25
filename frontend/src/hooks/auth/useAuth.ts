import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, getCurrentUser, register } from '@/services/authService';

export const useAuth = () => {
    const queryClient = useQueryClient();

    const userQuery = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: getCurrentUser,
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        },
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        }
    })

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'user'], null);
        },
    });

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
        error: userQuery.error,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        registerUser: registerMutation.mutate,
        isAuthenticated: !!userQuery.data,
    };
};