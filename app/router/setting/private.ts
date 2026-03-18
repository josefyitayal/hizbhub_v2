import z from "zod";
import db from "@/db/drizzle";
import { groups, GroupSchema } from "@/db/schemas";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { and, eq } from "drizzle-orm";

export const listPrivateSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/private",
        method: "GET",
        summary: "get private settings",
        tags: ["privateSetting"]
    })
    .input(z.object({ groupId: z.string() }))
    .output(z.object({ private: z.boolean().nullable() }))
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .select({
                private: groups.private,
            })
            .from(groups)
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))

        if (!result) throw errors.NOT_FOUND()

        return result
    })


export const updatePrivateSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/private",
        method: "POST",
        summary: "update private settings",
        tags: ["privateSetting"]
    })
    .input(z.object({ groupId: z.string(), private: z.boolean() }))
    .output(GroupSchema)
    .handler(async ({ context, input, errors }) => {
        const [result] = await db
            .update(groups)
            .set({
                private: input.private,
            })
            .where(and(eq(groups.ownerId, context.user.id), eq(groups.id, input.groupId)))
            .returning()

        if (!result) throw errors.NOT_FOUND()

        return result
    })
