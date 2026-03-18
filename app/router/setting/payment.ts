import z from "zod";
import db from "@/db/drizzle";
import { groups, GroupSchema } from "@/db/schemas";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { and, eq } from "drizzle-orm";

const listPaymentSettingOutput = z.object({
    phoneNumber: z.string().nullable()
})

export const listPaymentSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/payment",
        method: "GET",
        summary: "get general settings data",
        tags: ["generalSetting"]
    })
    .input(z.object({ groupId: z.string() }))
    .output(listPaymentSettingOutput)
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .select({
                phoneNumber: groups.phoneNumber,
            })
            .from(groups)
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))

        if (!result) throw errors.NOT_FOUND()

        return result
    })



export const updatePaymentSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/general",
        method: "POST",
        summary: "update general settings",
        tags: ["generalSetting"]
    })
    .input(z.object({ groupId: z.string(), phoneNumber: z.string() }))
    .output(GroupSchema)
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .update(groups)
            .set({
                phoneNumber: input.phoneNumber,
            })
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))
            .returning()

        if (!result) throw errors.NOT_FOUND()

        return result
    })

