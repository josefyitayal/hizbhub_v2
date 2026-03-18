import { z } from "zod"

export const affiliateOnboardingFormSchema = z.object({
    referralCode: z.string().min(3, "Referral code must be at least 3 characters").max(20, "Referral code must be at most 20 characters"),
    telebirr: z.string().min(10, "Invalide Telebirr phone number").max(10, "Invalide Telebirr phone number"),
})

export type affiliateOnboardingFormTypes = z.infer<typeof affiliateOnboardingFormSchema>;
