export interface Capsule {
    id: string;
    ownerId: string;
    title: string;
    message: string;
    attachments: Attachment[];
    attachmentsSize: number;
    delivered: boolean;
    deliveryDate: string
    readCount: number
    createdAt: string
}

interface Attachment {
    path: string;
    size: number;
    type: string
}

export interface CapsulesResponse {
    page: number;
    limit: number;
    size: number;
    totalCapsules: number;
    delivered:{
        pageSize:number,
        total:number,
        capsules: Capsule[];
    };
    pending:{
        pageSize:number,
        total:number,
        capsules: Capsule[];
    }
}