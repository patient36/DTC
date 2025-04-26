import { z } from 'zod';

export const updateUserSchema = z
    .object({
        name: z.string().min(1, 'Name must be at least 1 characters').max(30).optional(),
        email: z.string().email('Invalid email').optional(),
        oldPassword: z.string().min(6, 'Old password must be at least 6 characters').optional().or(z.literal('')),
        newPassword: z.string().min(6, 'New password must be at least 6 characters').optional().or(z.literal('')),
    })
    .refine(
        (data) => {
            if (data.oldPassword && !data.newPassword) return false;
            if (data.newPassword && !data.oldPassword) return false;
            return true;
        },
        {
            message: 'Both old and new passwords must be provided together',
            path: ['newPassword'],
        }
    );

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;