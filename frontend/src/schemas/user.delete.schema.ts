import { z } from 'zod';

export const deleteUserSchema = z
    .object({
        password: z.string().min(6, 'Old password must be at least 6 characters')
    })

export type deleteUserFormValues = z.infer<typeof deleteUserSchema>;