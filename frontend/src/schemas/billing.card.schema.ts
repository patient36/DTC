import { z } from 'zod'

export const billingSchema = z.object({
    cardHolderName: z.string().min(1,'Name on card is required'),
})

export type BillingFormValues = z.infer<typeof billingSchema>