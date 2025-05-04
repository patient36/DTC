import axios from '@/lib/axios.config';

export const getAdminToken = async (password: string) => {
    const { data } = await axios.post('/admin/get-token', { password });
    return data;
}

export const registerAdmin = async (data: any) => {
    const { data: response } = await axios.post('/admin/create', data);
    return response;
}

export const getAllUsers = async (page: number, limit: number) => {
    const { data } = await axios.get('/admin/users', { params: { page, limit } });
    return data;
}

export const getAllPayments = async (page: number, limit: number) => {
    const { data } = await axios.get('/admin/payments', { params: { page, limit } });
    return data;
}

export const deleteUser = async (id: string) => {
    const { data } = await axios.delete(`/admin/users/${id}`);
    return data;
}
