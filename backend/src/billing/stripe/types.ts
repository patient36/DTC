export interface BillableUser {
    id: string;
    customerId: string;
    paymentMethodId: string;
    usedStorage: number;
    email: string;
    name?: string;
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    error?: string;
}

export interface WebhookResponse {
    received: boolean;
    message?: string;
}