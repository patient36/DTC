import axios from '@/lib/axios.config';

export const createCapsule = async (capsule: FormData) => {
    const { data } = await axios.post('/capsules/create', capsule, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const getCapsuleById = async (id: string) => {
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