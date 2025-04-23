import { z } from 'zod'

export const updateUserSchema = z
    .object({
        name: z.string().min(3, 'Name must be at least 3 characters').max(30).optional(),
        email: z.string().email('Invalid email').optional(),
        oldPassword: z.string().min(6, 'Old password must be at least 6 characters').optional(),
        newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
    })
    .refine(
        data => !data.oldPassword || !!data.newPassword,
        {
            message: 'New password is required when old password is provided',
            path: ['newPassword'],
        }
    )

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;