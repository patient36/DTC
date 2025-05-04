import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminToken, getAllUsers, getAllPayments, deleteUser, registerAdmin } from "@/services/AdminService";
import { PaymentsResponse } from "@/types/payment";
import { UsersResponse } from "@/types/user";

export const useAdmin = (page = 1, limit = 10, password?: string) => {
  const queryClient = useQueryClient();

  // Users Query & Mutation
  const usersQuery = useQuery<UsersResponse>({
    queryKey: ['admin', 'users', page, limit],
    queryFn: () => getAllUsers(page, limit),
    retry: false,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  // Payments Query
  const paymentsQuery = useQuery<PaymentsResponse>({
    queryKey: ['admin', 'payments', page, limit],
    queryFn: () => getAllPayments(page, limit),
    retry: false,
  });

  // Admin Token Mutation & Query
  const getAdminTokenMutation = useMutation({
    mutationFn: (password: string) => getAdminToken(password),
    onSuccess: (data) => queryClient.setQueryData(['admin', 'token'], data),
    onError: () => queryClient.setQueryData(['admin', 'token'], null),
  });

  const tokenQuery = useQuery({
    queryKey: ["admin", "token"],
    enabled: false,
  });

  // Create Admin Mutation
  const createAdminMutation = useMutation({
    mutationFn: (variables: { password: string, token: string, name: string, email: string }) => registerAdmin(variables),
  });

  return {
    // Users
    users: usersQuery.data,
    usersLoading: usersQuery.isLoading,
    usersError: usersQuery.isError,
    usersErrorDetail: usersQuery.error,

    // Payments
    payments: paymentsQuery.data,
    paymentsLoading: paymentsQuery.isLoading,
    paymentsError: paymentsQuery.isError,
    paymentsErrorDetail: paymentsQuery.error,

    // Admin Token
    getAdminToken: getAdminTokenMutation.mutate,
    adminTokenLoading: getAdminTokenMutation.isPending,
    adminTokenError: getAdminTokenMutation.error,
    token: tokenQuery.data,
    tokenLoading: tokenQuery.isLoading,
    tokenError: tokenQuery.error,

    // Create Admin
    createAdmin: createAdminMutation.mutate,
    isCreatingAdmin: createAdminMutation.isPending,
    createAdminError: createAdminMutation.error,
    createAdminSuccess: createAdminMutation.isSuccess,

    // Delete User
    deleteUser: deleteUserMutation.mutate,
    isDeletingUser: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.error,
  };
};
