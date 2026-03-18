import z from "zod";
import db from "@/db/drizzle";
import { channels, ChannelSchema, groups, GroupSchema } from "@/db/schemas";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { and, asc, desc, eq } from "drizzle-orm";
import { postPermissionEnum, replayPermissionEnum } from "@/zod-schema/createChannelZodSchema";

export const listChannelSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/channel",
        method: "GET",
        summary: "get channel settings",
        tags: ["channelSetting"]
    })
    .input(z.object({ groupId: z.string() }))
    .output(z.array(ChannelSchema))
    .handler(async ({ input, errors }) => {
        const result = await db
            .select()
            .from(channels)
            .where(eq(channels.groupId, input.groupId))
        orderBy: [asc(channels.createdAt)]

        if (!result) throw errors.NOT_FOUND()

        return result
    })

export const updateChannelSettingsInput = z.object({
    groupId: z.string(),
    channelId: z.string(),
    channelName: z.string(),
    postPermission: postPermissionEnum,
    replayPermission: replayPermissionEnum,
})

export const updateChannelSettings = base
    .use(requiredAuthMiddleware)
    .route({
        path: "/settings/channel",
        method: "POST",
        summary: "update channel settings",
        tags: ["channelSetting"]
    })
    .input(updateChannelSettingsInput)
    .output(ChannelSchema)
    .handler(async ({ input, errors }) => {
        const [result] = await db
            .update(channels)
            .set({
                name: input.channelName,
                postPermission: input.postPermission,
                replayPermission: input.replayPermission,
            })
            .where(and(eq(channels.id, input.channelId), eq(channels.groupId, input.groupId)))
            .returning()

        if (!result) throw errors.NOT_FOUND()

        return result
    })
