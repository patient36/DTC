import axios from '@/lib/axios.config';

export const createCapsule = async () => {
    const { data } = await axios.post('/capsules/create');
    return data;
};

export const getCapsule = async (id: string) => {
    const { data } = await axios.get(`/capsules/${id}`);
    return data;
};


export const getCapsules = async (page: number, limit: number) => {
    const { data } = await axios.get(`/capsules?page=${page}&limit=${limit}`);
    return data;
};

export const deleteCapsule = async (id: string) => {
    const { data } = await axios.delete(`/capsules/${id}`);
    return data;
};