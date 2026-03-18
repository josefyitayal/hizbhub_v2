import { z } from "zod"

export const onboardingSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters.")
        .max(19, "First name must be at most 19 characters."),
    lastName: z
        .string()
        .min(2, "last name must be at least 2 characters.")
        .max(19, "last name must be at most 19 characters."),
    userName: z
        .string()
        .min(4, "Username must be at least 4 characters.")
        .max(15, "Username must be at most 15 characters."),
    bio: z
        .string()
        .min(7, "Bio must be at least 7 characters.")
        .max(100, "Bio must be at most 100 characters."),
    profilePicture: z
        .string()
})
