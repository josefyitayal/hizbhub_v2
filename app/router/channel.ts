import { z } from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { createChannelFormSchema } from "@/zod-schema/createChannelZodSchema";
import { Channel, channels, ChannelSchema, groups } from "@/db/schemas";

export const createChannel = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/channel/create",
        summary: "create new channel",
        tags: ["channel"]
    })
    .input(createChannelFormSchema.extend({
        groupSlug: z.string().min(1, "Group slug is required."),
    }))
    .output(z.object({ channel: ChannelSchema, groupSlug: z.string() }))
    .handler(async ({ input, errors }) => {
        const [dbGroup] = await db.select().from(groups).where(eq(groups.slug, input.groupSlug))

        const values = {
            name: input.name,
            postPermission: input.postPermission,
            replayPermission: input.replayPermission,
            groupId: dbGroup.id,
        }
        const [dbChannel] = await db.insert(channels).values(values).returning()

        if (dbChannel) {
            return {
                channel: dbChannel,
                groupSlug: input.groupSlug,
            }
        } else {
            throw errors.NOT_FOUND()
        }
    })


export const getChannelById = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/channel/byId",
        summary: "get channel by id",
        tags: ["channel"]
    })
    .input(z.object({ channelId: z.string(), groupId: z.string() }))
    .output(ChannelSchema)
    .handler(async ({ input, errors }) => {
        const dbChannel = await db.query.channels.findFirst({
            where: and(eq(channels.id, input.channelId), eq(channels.groupId, input.groupId)),
        })
        if (!dbChannel) throw errors.NOT_FOUND()
        return dbChannel
    })


export const deleteChannel = base
    .use(requiredAuthMiddleware)
    .route({
        method: "DELETE",
        path: "/channel/delete",
        summary: "delete channel",
        tags: ["channel"]
    })
    .input(z.object({ channelId: z.string() }))
    .output(z.custom<Channel>())
    .handler(async ({ input, errors }) => {
        const [dbChannel] = await db.delete(channels).where(eq(channels.id, input.channelId)).returning()
        if (!dbChannel) throw errors.NOT_FOUND()
        return dbChannel
    })
