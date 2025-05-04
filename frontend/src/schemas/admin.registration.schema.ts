import { z } from 'zod';

export const registerAdminSchema = z
    .object({
        name: z.string().min(3, 'Name must be at least 3 characters').max(30),
        email: z.string().email('Invalid email address'),
        adminToken: z.string().min(10, "Token can't be that short"),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords must match',
    });

export type RegisterAdminFormValues = z.infer<typeof registerAdminSchema>;