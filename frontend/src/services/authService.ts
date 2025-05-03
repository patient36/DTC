import axios from '@/lib/axios.config';
import { RegisterFormValues } from '@/schemas/register.schema';
import { ResetPasswordFormValues } from '@/schemas/reset.password.schema';

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

export const getResetPasswordToken = async ({ email }: { email: string }) => {
    const { data } = await axios.post('/auth/get-reset-token', { email })
}

export const resetPassword = async ({ email, token, newPassword }: ResetPasswordFormValues) => {
    const { data } = await axios.post('/auth/reset-password', { email, token, newPassword })
    return data
}