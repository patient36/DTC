const baseURL = process.env.NEXT_PUBLIC_API;

type ApiResponse<T> = Promise<T>;

export const api = {
  get: async <T>(endpoint: string): ApiResponse<T> => {
    const res = await fetch(`${baseURL}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
    return res.json() as Promise<T>;
  },

  post: async <T>(endpoint: string, body: object): ApiResponse<T> => {
    const res = await fetch(`${baseURL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
    return res.json() as Promise<T>;
  },

  patch: async <T>(endpoint: string, body: object): ApiResponse<T> => {
    const res = await fetch(`${baseURL}${endpoint}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
    return res.json() as Promise<T>;
  },

  put: async <T>(endpoint: string, body: object): ApiResponse<T> => {
    const res = await fetch(`${baseURL}${endpoint}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
    return res.json() as Promise<T>;
  },

  delete: async <T>(endpoint: string): ApiResponse<T> => {
    const res = await fetch(`${baseURL}${endpoint}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
    return res.json() as Promise<T>;
  },
};