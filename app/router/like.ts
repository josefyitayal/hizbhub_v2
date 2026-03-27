import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import db from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { likes, LikeSchema } from "@/db/schemas";

export const createLike = base
    .use(requiredAuthMiddleware)
    .route({
        method: "POST",
        path: "/like",
        summary: "create/like comment or post",
        tags: ['like']
    })
    .input(z.object({ postId: z.string().optional(), commentId: z.string().optional() }))
    .output(LikeSchema)
    .handler(async ({ input, context }) => {
        if (!input.postId && !input.commentId) {
            throw new Error("Either postId or commentId must be provided");
        }

        // Prevent duplicate likes
        const existing = await db
            .select()
            .from(likes)
            .where(
                and(
                    eq(likes.userId, context.user.id),
                    input.postId
                        ? eq(likes.postId, input.postId)
                        : eq(likes.commentId, input.commentId!)
                )
            );

        if (existing.length > 0) {
            return existing[0]; // already liked
        }

        // Insert new like
        const [newLike] = await db
            .insert(likes)
            .values({
                userId: context.user.id,
                postId: input.postId ?? null,
                commentId: input.commentId ?? null,
            })
            .returning();

        return newLike;
    })


export const deleteLike = base
    .use(requiredAuthMiddleware)
    .route({
        method: "DELETE",
        path: "/like",
        summary: "create/like comment or post",
        tags: ['like']
    })
    .input(z.object({ postId: z.string().optional(), commentId: z.string().optional() }))
    .output(LikeSchema)
    .handler(async ({ input, context }) => {
        if (!input.postId && !input.commentId) {
            throw new Error("Either postId or commentId must be provided");
        }

        // delete like
        const [newLike] = await db
            .delete(likes)
            .where(
                and(
                    eq(likes.userId, context.user.id),
                    input.postId
                        ? eq(likes.postId, input.postId)
                        : eq(likes.commentId, input.commentId!)
                )
            )
            .returning();

        return newLike;
    })