import { z } from 'zod'

export const capsuleSchema = z.object({
    title: z.string().min(1, "Title must be at least 1 characters").max(50),
    message: z.string().min(20, "Message must be at least 20 characters").max(1000),
    deliveryDate: z
        .string()
        .refine((val) => {
            const date = new Date(val)
            const min = new Date()
            min.setMonth(min.getMonth() + 3)
            return date >= min
        }, {
            message: "Delivery must be at least 3 months from now"
        })
        .transform((val) => new Date(val).toISOString()),
    attachments: z.array(z.instanceof(File))
})

export type CapsuleFormValues = z.infer<typeof capsuleSchema>