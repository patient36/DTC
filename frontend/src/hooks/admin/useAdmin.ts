import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminToken, getAllUsers, getAllPayments, deleteUser, registerAdmin, getUser } from "@/services/AdminService";
import { PaymentsResponse } from "@/types/payment";
import { UsersResponse, UserResponse } from "@/types/user";

export const useAdmin = (page = 1, limit = 10) => {

  // Users Query & Mutation
  const usersQuery = useQuery<UsersResponse>({
    queryKey: ['admin', 'users', page, limit],
    queryFn: () => getAllUsers(page, limit),
    retry: false,
  });

  // Payments Query
  const paymentsQuery = useQuery<PaymentsResponse>({
    queryKey: ['admin', 'payments', page, limit],
    queryFn: () => getAllPayments(page, limit),
    retry: false,
  });


  // Create Admin Mutation
  const createAdminMutation = useMutation({
    mutationFn: (variables: { password: string, adminToken: string, name: string, email: string }) => registerAdmin(variables),
  });

  return {
    // Users
    usersData: usersQuery.data,
    usersLoading: usersQuery.isLoading,
    usersError: usersQuery.isError,
    usersErrorDetail: usersQuery.error,

    // Payments
    paymentsData: paymentsQuery.data,
    paymentsLoading: paymentsQuery.isLoading,
    paymentsError: paymentsQuery.isError,
    paymentsErrorDetail: paymentsQuery.error,

    // Create Admin
    createAdmin: createAdminMutation.mutate,
    isCreatingAdmin: createAdminMutation.isPending,
    createAdminError: createAdminMutation.error,
    createAdminSuccess: createAdminMutation.isSuccess,
  };
};


export const useToken = () => {
  const getAdminTokenMutation = useMutation({
    mutationFn: (password: string) => getAdminToken(password)
  });

  return {
    getAdminToken: getAdminTokenMutation.mutate,
  }

}

export const useManageUsers = (id: string) => {
  const queryClient = useQueryClient()

  const userQuery = useQuery<UserResponse>({
    queryKey: ['admin', 'users', id],
    queryFn: () => getUser(id),
    retry: false,
  })

  const deleteUserMutation = useMutation({
    mutationFn: (variables: { id: string, password: string }) => deleteUser(id, variables.password),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: query =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'admin' &&
          query.queryKey[1] === 'users',
      });
    }

  })

  return {
    // user
    data: userQuery.data,
    userLoading: userQuery.isLoading,
    userError: userQuery.isError,

    // delete
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
    isDeletingError: deleteUserMutation.isError
  }
}