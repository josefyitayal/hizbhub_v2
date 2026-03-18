import { z } from "zod";
import { and, eq, lt, desc } from "drizzle-orm";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { comments, CommentSchema, UserSchema } from "@/db/schemas";
import { clerkClient } from "@clerk/nextjs/server";

export const getCommentsByPostIdOutput = z.object({
    comments: z.array(CommentSchema.extend({ user: UserSchema })), // Define your actual Comment schema here
    nextCursor: z.string().nullish(), // null if no more items
})

export const getCommentsByPostId = base
    .route({
        method: "GET",
        path: "/comments/byPost",
        summary: "Get comments with pagination",
        tags: ["comment"]
    })
    .input(
        z.object({
            postId: z.string(),
            cursor: z.string().optional(), // The ID or Date of the last comment fetched
        })
    )
    .output(z.object({
        comments: z.array(CommentSchema.extend({ user: UserSchema })), // Define your actual Comment schema here
        nextCursor: z.string().nullish(), // null if no more items
    }))
    .handler(async ({ input }) => {
        const limit = 10;

        const items = await db.query.comments.findMany({
            where: and(
                eq(comments.postId, input.postId),
                // If a cursor exists, fetch items created BEFORE that cursor (assuming NEWEST first)
                // Note: This assumes your cursor is the ID. If using Date, parse input.cursor to Date.
                // For strict ordering, typically we use (createdAt < cursorDate) OR (createdAt = cursorDate AND id < cursorId)
                input.cursor ? lt(comments.createdAt, new Date(input.cursor)) : undefined
            ),
            limit: limit + 1, // Fetch 1 extra to check if there is a next page
            orderBy: desc(comments.createdAt), // Assuming ID is sortable (like UUIDv7 or Serial). If not, use createdAt.
            with: {
                user: true // Fetch the user who commented
            }
        });

        // --- SMART BATCH FETCH START ---
        // 1. Collect all unique clerkIds from the posts
        const clerkIds = [...new Set(items.map(p => p.user?.clerkId).filter(Boolean) as string[])];

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
        if (items.length > limit) {
            // We do NOT pop(). We want to show all 11 items.
            // The cursor for the NEXT fetch will be the 11th item's timestamp.
            nextCursor = items[items.length - 1].createdAt.toISOString();
        }


        const updatedItems = items.map(item => ({
            ...item,
            user: {
                ...item.user,
                profilePicture: clerkUserMap.get(item.user.clerkId) ?? item.user.profilePicture,
            }
        }));

        return {
            comments: updatedItems,
            nextCursor,
        };
    });


export const createComment = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/comments",
        summary: "Get comments with pagination",
        tags: ["comment"]
    })
    .input(z.object({ postId: z.string(), content: z.string() }))
    .output(CommentSchema)
    .handler(async ({ input, context, errors }) => {
        const [dbComment] = await db.insert(comments).values({
            userId: context.user.id,
            postId: input.postId,
            content: input.content
        }).returning()

        if (!dbComment) {
            throw errors.NOT_FOUND()
        }

        return dbComment
    })



