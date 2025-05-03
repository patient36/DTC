import { z } from 'zod';

export const ResetPasswordSchema = z.object({
    token: z.string().min(10, "Token can't be that short"),
    email: z.string().email('Invalid email address'),
    newPassword: z.string().min(6, 'New password has to be at least 6 characters')
})

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export const GetResetTokenSchema = z.object({
    email: z.string().email('Invalid email address')
})

export type GetResetTokenFormValues = z.infer<typeof GetResetTokenSchema>