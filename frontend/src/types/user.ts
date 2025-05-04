export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    usedStorage: number;
    customerId?: string;
    subscriptionId?: string;
    paidUntil: string;
    createdAt: string;
}

export interface UsersResponse {
    page: number;
    limit: number;
    totalUsers: number;
    admins: {
        size: number;
        users: User[];
        total: number;
    };
    users: {
        size: number;
        users: User[];
        total: number;
    };
};