import axiosBase, { AxiosError, AxiosResponse } from 'axios';

const axios = axiosBase.create({
  baseURL: process.env.NEXT_PUBLIC_API!,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const MAX_ERROR_LENGTH = 200;

type ErrorResponseData = {
  message?: string | string[];
};

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponseData>) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error'));
    }

    const { status, statusText, data } = error.response;

    const messages: Record<number, string> = {
      400: 'Bad Request - Invalid data sent',
      401: 'Unauthorized - Please login again',
      403: 'Forbidden - You do not have permission to access this resource',
      500: 'Server Error - Please try again later',
    };

    const fallbackMessage = messages[status] || `Error ${status}: ${statusText}`;

    let message = fallbackMessage;
    if (data?.message) {
      message = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message;
    }

    if (message.length > MAX_ERROR_LENGTH) {
      message = message.slice(0, MAX_ERROR_LENGTH) + '...';
    }

    return Promise.reject(new Error(message));
  }
);

export default axios;
