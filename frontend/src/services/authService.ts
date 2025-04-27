import axios from '@/lib/axios.config';
import { RegisterFormValues } from '@/schemas/register.schema';

export const login = async (credentials: { email: string; password: string }) => {
    const { data } = await axios.post('/auth/login', credentials);
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await axios.get(`/auth/me`);
    return data;
};

export const logout = async () => {
    const { data } = await axios.post('/auth/logout');
    return data;
};

export const register = async ({ name, email, password, confirmPassword, }: RegisterFormValues) => {
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
    const { data } = await axios.post('/auth/register', { name, email, password });
    return data;
};
