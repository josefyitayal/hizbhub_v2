import { z } from "zod"

export const paymentFormSchema = z.object({
    receiptNumber: z.string().min(5).max(15)
})

export type paymentFormSchemaTypes = z.infer<typeof paymentFormSchema>;
