import axios from '@/lib/axios.config';

export const updateUser = async (
    updates: Partial<{ name: string; email: string; oldPassword: string; newPassword: string }>,
    id: string
) => {
    const { data } = await axios.put(`/users/${id}`, updates);
    return data;
};

export const deleteUser = async (id: string, password: string) => {
    const { data } = await axios.delete(`/users/${id}`, {
        data: { password },
    });
    return data;
};

export const getPayments = async (page: number, limit: number) => {
    const { data } = await axios.get(`/users/payments?page=${page}&limit=${limit}`);
    return data;
};