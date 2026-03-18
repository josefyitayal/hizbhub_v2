import z from "zod";
import db from "@/db/drizzle";
import { groups, GroupSchema } from "@/db/schemas";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { and, eq } from "drizzle-orm";
import { generalSettingsFormSchema } from "@/zod-schema/settingsZodSchema";
import slugify from "slugify";
import { nanoid } from "nanoid";

export const generalSettingsOutput = GroupSchema.omit({
    slug: true,
    price: true,
    private: true,
    phoneNumber: true,
    pricingEnabledAt: true,
    titleSearch: true,
})
export const listGeneralSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/general",
        method: "GET",
        summary: "get general settings data",
        tags: ["generalSetting"]
    })
    .input(z.object({ groupId: z.string() }))
    .output(generalSettingsOutput)
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .select({
                id: groups.id,
                title: groups.title,
                description: groups.description,
                longDescription: groups.longDescription,
                icon: groups.icon,
                bannerImage: groups.bannerImage,
                category: groups.category,
                tags: groups.tags,
                ownerId: groups.ownerId,
                createdAt: groups.createdAt,
                updatedAt: groups.updatedAt
            })
            .from(groups)
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))

        if (!result) throw errors.NOT_FOUND()

        return result
    })

export const updateGeneralSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/general",
        method: "POST",
        summary: "update general settings",
        tags: ["generalSetting"]
    })
    .input(z.object({ groupId: z.string(), data: generalSettingsFormSchema }))
    .output(GroupSchema)
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .update(groups)
            .set({
                // Only include the slug key if title exists and is not empty
                ...(input.data.title && {
                    slug: `${slugify(input.data.title)}-${nanoid(6)}`
                }),
                ...input.data
            })
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))
            .returning();

        if (!result) throw errors.NOT_FOUND()

        return result
    })
