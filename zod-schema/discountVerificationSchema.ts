import { z } from "zod";

export const discountVerificationSchema = z.object({
    discountId: z.string(),
    code: z.string(),
    type: z.enum(["percentage", "fixed"]),
    value: z.number(),
    originalAmount: z.number(),
    finalAmount: z.number(),
    amountOff: z.number(),
    planId: z.string(),
});

export type DiscountVerification = z.infer<typeof discountVerificationSchema>;
