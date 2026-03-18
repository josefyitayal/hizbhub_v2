import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { and, eq, lt } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { Post, posts, PostSchema, UserSchema } from "@/db/schemas";

const createPostInput = z.object({
    channelId: z.string(),
    groupId: z.string(),
    content: z.string(),
    attachment: z.string().nullable()
})

export const createPost = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/channel",
        summary: "create channel",
        tags: ["channel"]
    })
    .input(createPostInput)
    .output(z.custom<Post>())
    .handler(async ({ context, input, errors }) => {
        const [dbPost] = await db.insert(posts).values({
            userId: context.user.id,
            channelId: input.channelId,
            groupId: input.groupId,
            content: input.content,
            attachment: input.attachment
        }).returning()

        if (!dbPost) throw errors.NOT_FOUND()

        return dbPost
    })

export const finalPostsSchema = z.array(PostSchema.extend({
    hasUserLiked: z.boolean(),
    isOwner: z.boolean(),
    likes: z.number(),
    user: UserSchema.nullable(),
    comments: z.number()
}))

export const getPostByChannelIdOutput = z.object({
    posts: finalPostsSchema,
    nextCursor: z.string().nullish(), // null if no more items
})

export const getPostByChannelId = base
    .use(requiredAuthMiddleware)
    .route({
        method: "GET",
        path: "/channel",
        summary: "get post by channel id",
        tags: ["channel"]
    })
    .input(z.object({ channelId: z.string(), groupId: z.string(), cursor: z.string().optional() }))
    .output(getPostByChannelIdOutput)
    .handler(async ({ input, context }) => {
        const currentUserId = context.user.id;
        const limit = 20;

        try {
            // 1. Fetch posts with their relations
            // Drizzle handles the complex SQL behind the scenes here
            const postsWithData = await db.query.posts.findMany({
                where: (posts, { and, eq }) => and(
                    eq(posts.groupId, input.groupId),
                    eq(posts.channelId, input.channelId),

                    // 1. If we HAVE a cursor, only fetch non-pinned posts that are older than the cursor
                    // 2. If we DON'T have a cursor (Page 1), fetch everything (Pinned will be top due to orderBy)
                    input.cursor
                        ? and(lt(posts.createdAt, new Date(input.cursor)), eq(posts.isPinned, false))
                        : undefined
                ),
                with: {
                    user: true,
                    likes: true,
                    comments: true,
                },
                limit: limit + 1, // Fetch 1 extra to check if there is a next page
                orderBy: (posts, { desc, asc }) => [
                    desc(posts.isPinned),   // 1. Pinned posts first
                    asc(posts.pinnedAt),    // 2. Oldest "pin" date first (stays at top)
                    desc(posts.createdAt)   // 3. Regular posts by newest first
                ],
            });

            // --- SMART BATCH FETCH START ---
            // 1. Collect all unique clerkIds from the posts
            const clerkIds = [...new Set(postsWithData.map(p => p.user?.clerkId).filter(Boolean) as string[])];

            // 2. Fetch all these users from Clerk in ONE request
            const client = await clerkClient();
            const { data: clerkUsers } = await client.users.getUserList({
                userId: clerkIds,
                limit: 100, // Clerk limit
            });

            // 3. Create a lookup map for O(1) access inside the .map() loop
            const clerkUserMap = new Map(clerkUsers.map(u => [u.id, u.imageUrl]));
            // --- SMART BATCH FETCH END ---

            let nextCursor: string | undefined = undefined;

            // If we have more than 10, the 11th item is the start of the next page
            if (postsWithData.length > limit) {
                // We do NOT pop(). We want to show all 11 items.
                // The cursor for the NEXT fetch will be the 11th item's timestamp.
                nextCursor = postsWithData[postsWithData.length - 1].createdAt.toISOString();
            }

            // 2. Map the data to match your oRPC output exactly
            const finalPosts = postsWithData.map((p) => {
                return {
                    id: p.id,
                    content: p.content,
                    attachment: p.attachment,
                    groupId: p.groupId,
                    channelId: p.channelId,
                    userId: p.userId,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt, // Corrected from 'updateAt'
                    isPinned: p.isPinned,
                    pinnedAt: p.pinnedAt, // This will be Date | null

                    // Ensure the user object matches UserSchema
                    user: p.user ? {
                        ...p.user,
                        // Use the fresh URL from the Map, fallback to DB if not found
                        profilePicture: clerkUserMap.get(p.user.clerkId) ?? p.user.profilePicture,
                    } : null,

                    // Compute counts in JS
                    likes: p.likes.length,
                    comments: p.comments.length,

                    // Logical checks
                    hasUserLiked: p.likes.some(like => like.userId === currentUserId),
                    isOwner: p.userId === currentUserId,
                };
            });

            return {
                posts: finalPosts,
                nextCursor,
            }

        } catch (error) {
            // This will now show up in your console if the DB fails!
            console.error("CRITICAL PROCEDURE ERROR:", error);
            throw error;
        }
    })



export const deletePost = base
    .use(requiredAuthMiddleware)
    .route({
        method: "DELETE",
        path: "/post",
        summary: "delete post id",
        tags: ["post"]
    })
    .input(z.object({ postId: z.string(), groupId: z.string() }))
    .output(PostSchema)
    .handler(async ({ input, errors }) => {
        const [result] = await db
            .delete(posts)
            .where(and(eq(posts.id, input.postId), eq(posts.groupId, input.groupId)))
            .returning()

        if (!result) {
            throw errors.NOT_FOUND()
        }

        return result
    })



export const pinPost = base
    .use(requiredAuthMiddleware)
    .route({
        method: "PUT",
        path: "/post",
        summary: "pin post id",
        tags: ["post"]
    })
    .input(z.object({ postId: z.string(), groupId: z.string(), currentPin: z.boolean() }))
    .output(PostSchema)
    .handler(async ({ input, errors }) => {
        const [result] = await db
            .update(posts)
            .set({
                isPinned: !input.currentPin,
                pinnedAt: !input.currentPin ? new Date() : null,
            })
            .where(and(eq(posts.id, input.postId), eq(posts.groupId, input.groupId)))
            .returning();

        if (!result) {
            throw errors.NOT_FOUND()
        }

        return result
    })
