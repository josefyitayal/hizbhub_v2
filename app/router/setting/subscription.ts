import z from "zod";
import db from "@/db/drizzle";
import { groups, GroupSchema } from "@/db/schemas";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { and, eq } from "drizzle-orm";

const listSubscriptionSettingOutput = z.object({
    price: z.number().nullable()
})

export const listSubscriptionSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/payment",
        method: "GET",
        summary: "get general settings data",
        tags: ["generalSetting"]
    })
    .input(z.object({ groupId: z.string() }))
    .output(listSubscriptionSettingOutput)
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .select({
                price: groups.price,
            })
            .from(groups)
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))

        if (!result) throw errors.NOT_FOUND()

        return result
    })



export const updateSubscriptionSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/subscription",
        method: "POST",
        summary: "update subscription setting",
        tags: ["subscriptionSetting"]
    })
    .input(z.object({ groupId: z.string(), price: z.number() }))
    .output(GroupSchema)
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .update(groups)
            .set({
                price: input.price,
                pricingEnabledAt: new Date(),
            })
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))
            .returning()

        if (!result) throw errors.NOT_FOUND()

        return result
    })
