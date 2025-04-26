export interface Payment {
    id: string;
    payerId: string;
    method: 'CARD' | string;
    amount: number;
    currency: string;
    paymentId: string;
    description: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentsResponse {
    page: number;
    limit: number;
    size: number;
    total: number;
    payments: Payment[];
}