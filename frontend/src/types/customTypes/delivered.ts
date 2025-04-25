export interface Attachment {
  path: string;
  size: number;
  type: string;
}

export interface Capsule {
  id: string;
  ownerId: string;
  title: string;
  message: string;
  attachments: Attachment[];
  attachmentsSize: number;
  delivered: boolean;
  deliveryDate: Date;
  readCount: number;
  createdAt: Date;
}

export type SortDirection = 'asc' | 'desc';
export type SortableKey = keyof Omit<Capsule, 'attachments' | 'ownerId' | 'delivered'>;
export type ColumnKey = keyof ColumnVisibility;

export interface ColumnVisibility {
  id: boolean;
  title: boolean;
  deliveryDate: boolean;
  readCount: boolean;
  attachments: boolean;
  attachmentsSize: boolean;
  createdAt: boolean;
}

export interface SortConfig {
  key: SortableKey;
  direction: SortDirection;
}