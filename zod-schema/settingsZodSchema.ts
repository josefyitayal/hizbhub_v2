import { z } from "zod"

const emptyToNull = z.string().trim().optional().nullable().transform(val => {
    if (!val || val === "") return null;
    return val;
});

export const generalSettingsFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(20, "Name must be at most 20 characters"),

    description: emptyToNull.refine(
        val => val === null || (val.length >= 10 && val.length <= 200),
        {
            message: "Description must be between 10 and 200 characters",
        }
    ).nullish(),
    longDescription: emptyToNull.refine(val => {
        if (val === null) return true

        const plainText = val.replace(/<[^>]+>/g, "").trim()
        return plainText.length >= 10
    }, {
        message: "Long description must be at least 10 characters",
    }).nullish(),
    icon: emptyToNull.nullish(),
    bannerImage: emptyToNull.nullish(),
    category: z.array(z.string()).nullish().default(null),
    tags: z.array(z.string()).nullish().default(null),
})

export const subscriptionSettingFormSchema = z.object({
    price: z.number(),
})

export const paymentSettingFormSchema = z.object({
    phoneNumber: z.string().min(10).max(10)
})

export const privateSettingFormSchema = z.object({
    private: z.boolean()
})

export const tabsSettingsFormSchema = z.object({
    members: z.boolean(),
    courses: z.boolean(),
    community: z.boolean()
})


const postPermissionEnum = z.enum(["all", "admin"])
const replayPermissionEnum = z.enum(["all", "admin"])

export const channelsSettingsFormSchema = z.object({
    name: z.string().min(2).max(20),
    postPermission: postPermissionEnum,
    replayPermission: replayPermissionEnum,
})

export type generalSettingsFormTypes = z.infer<typeof generalSettingsFormSchema>;
export type subscriptionSettingFormTypes = z.infer<typeof subscriptionSettingFormSchema>;
export type paymentSettingFormTypes = z.infer<typeof paymentSettingFormSchema>;
export type privateSettingFormTypes = z.infer<typeof privateSettingFormSchema>;
export type tabsSettingsFormTypes = z.infer<typeof tabsSettingsFormSchema>;
export type channelsSettingsFormTypes = z.infer<typeof channelsSettingsFormSchema>;
