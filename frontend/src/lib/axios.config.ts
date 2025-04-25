import axiosBase, { AxiosError, AxiosResponse } from 'axios';

const axios = axiosBase.create({
  baseURL: process.env.NEXT_PUBLIC_API!,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject('Network error');
    }

    const { status, statusText } = error.response;

    const messages: Record<number, string> = {
      400: 'Bad Request - Invalid data sent',
      401: 'Unauthorized - Please login again',
      403: 'Forbidden - You do not have permission to access this resource',
      500: 'Server Error - Please try again later',
    };

    return Promise.reject(new Error(messages[status] || `Error ${status}: ${statusText}`));
  }
);

export default axios;