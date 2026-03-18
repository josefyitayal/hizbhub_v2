"use client"

import { useState } from "react";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";

type PostsQueryData = Awaited<ReturnType<typeof orpc.post.list.byChannelId.call>>
type Post = PostsQueryData['posts'][number]

const POSTS_QUERY_KEY = orpc.post.list.byChannelId.key

const updatePostOptimistically = (
    oldData: Post[] | undefined,
    postId: string,
    isLiking: boolean
) => {
    if (!oldData || !oldData.length) return oldData

    return oldData.map((post) => {
        if (post.id !== postId) return post

        const likesDelta = isLiking ? 1 : -1
        const likesCount = Math.max(0, (post.likes ?? 0) + likesDelta)

        return {
            ...post,
            likes: likesCount,
            hasUserLiked: isLiking,
        }
    })
}

interface UsePostLikeOptions {
    channelId: string;
    groupId: string;
}

type PostsResponse = Awaited<ReturnType<typeof orpc.post.list.byChannelId.call>>;

export function usePostLike({ channelId, groupId }: UsePostLikeOptions) {
    const queryClient = useQueryClient()
    const postsQueryKey = POSTS_QUERY_KEY({ input: { channelId, groupId } })
    const [pendingPostId, setPendingPostId] = useState<string | null>(null)

    // Like Mutation
    const likeMutation = useMutation(
        orpc.like.create.mutationOptions({
            onMutate: async ({ postId }) => {
                setPendingPostId(postId!)
                await queryClient.cancelQueries({ queryKey: postsQueryKey })

                const previousPosts = queryClient.getQueryData<InfiniteData<PostsResponse>>(postsQueryKey)

                // Optimistically update
                queryClient.setQueryData<InfiniteData<PostsResponse>>(
                    postsQueryKey,
                    (oldData) => {
                        if (!oldData) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                posts: page.posts.map((post) =>
                                    post.id === postId
                                        ? {
                                            ...post,
                                            hasUserLiked: true,
                                            likes: post.likes + 1
                                        }
                                        : post
                                )
                            }))
                        };
                    }
                )

                return { previousPosts }
            },
            onError: (error, _vars, context) => {
                // Rollback on error
                if (context?.previousPosts) {
                    queryClient.setQueryData(postsQueryKey, context.previousPosts)
                }
                toast.error(error.message)
            },
            onSettled: () => {
                setPendingPostId(null)
                // Refetch to get the actual data from the server
                queryClient.invalidateQueries({ queryKey: postsQueryKey })
            },
        })
    )

    // Unlike Mutation
    const unlikeMutation = useMutation(
        orpc.like.delete.mutationOptions({
            onMutate: async ({ postId }) => {
                setPendingPostId(postId!)
                await queryClient.cancelQueries({ queryKey: postsQueryKey })

                const previousPosts = queryClient.getQueryData<InfiniteData<PostsResponse>>(postsQueryKey)

                queryClient.setQueryData<InfiniteData<PostsResponse>>(
                    postsQueryKey,
                    (oldData) => {
                        if (!oldData) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                posts: page.posts.map((post) =>
                                    post.id === postId
                                        ? {
                                            ...post,
                                            hasUserLiked: true,
                                            likes: post.likes + 1
                                        }
                                        : post
                                )
                            }))
                        };
                    }
                )

                return { previousPosts }
            },
            onError: (error, _vars, context) => {
                // Rollback on error
                if (context?.previousPosts) {
                    queryClient.setQueryData(postsQueryKey, context.previousPosts)
                }
                toast.error(error.message)
            },
            onSettled: () => {
                setPendingPostId(null)
                // Refetch to get the actual data from the server
                queryClient.invalidateQueries({ queryKey: postsQueryKey })
            },
        })
    )

    // Unified Handler
    function handleLike(post: Post) {
        // Decide whether to like or unlike based on current state
        if (post.hasUserLiked) {
            // UNLIKE: User has liked, so call delete mutation
            unlikeMutation.mutate({ postId: post.id })
        } else {
            // LIKE: User has not liked, so call create mutation
            likeMutation.mutate({ postId: post.id })
        }
    }

    return {
        handleLike,
        likeMutation,
        unlikeMutation,
        isPending: pendingPostId !== null,
        pendingPostId,
    }
}

